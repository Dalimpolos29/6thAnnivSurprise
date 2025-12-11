/* =============================================
   DEN & ANNA - Supabase Client
   ============================================= */

// Initialize Supabase client
let supabase = null;

function initSupabase() {
  if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
    console.warn('Supabase not configured. Please update SUPABASE_CONFIG in config.js');
    return null;
  }

  supabase = window.supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
  );

  return supabase;
}

// Get Supabase instance
function getSupabase() {
  if (!supabase) {
    return initSupabase();
  }
  return supabase;
}

// =============================================
// Authentication Functions
// =============================================

async function loginUser(username, password) {
  // Validate credentials locally first (simple auth)
  const normalizedUsername = username.trim().toLowerCase();
  const validUsers = ['dennis', 'anna'];

  if (!validUsers.includes(normalizedUsername)) {
    throw new Error('Invalid username');
  }

  if (password !== APP_CONFIG.password) {
    throw new Error('Invalid password');
  }

  // Get user config
  const userConfig = normalizedUsername === 'dennis'
    ? APP_CONFIG.users.dennis
    : APP_CONFIG.users.anna;

  // Create session
  const session = {
    user: {
      id: normalizedUsername,
      name: userConfig.name,
      avatar: userConfig.avatar,
      username: userConfig.username
    },
    loggedInAt: new Date().toISOString()
  };

  // Store session
  localStorage.setItem('session', JSON.stringify(session));

  // If Supabase is configured, sync with database
  const sb = getSupabase();
  if (sb) {
    try {
      // Upsert user to database
      await sb.from('users').upsert({
        id: normalizedUsername,
        name: userConfig.name,
        avatar: userConfig.avatar,
        last_seen: new Date().toISOString(),
        is_online: true
      }, { onConflict: 'id' });
    } catch (error) {
      console.error('Error syncing user to database:', error);
    }
  }

  return session;
}

function logoutUser() {
  const session = getSession();

  // Update online status if Supabase is configured
  const sb = getSupabase();
  if (sb && session) {
    sb.from('users').update({
      is_online: false,
      last_seen: new Date().toISOString()
    }).eq('id', session.user.id).then(() => {
      console.log('User status updated');
    });
  }

  localStorage.removeItem('session');
  window.location.href = 'index.html';
}

function getSession() {
  const sessionStr = localStorage.getItem('session');
  if (!sessionStr) return null;

  try {
    return JSON.parse(sessionStr);
  } catch {
    return null;
  }
}

function isLoggedIn() {
  return getSession() !== null;
}

function getCurrentUser() {
  const session = getSession();
  return session ? session.user : null;
}

function getOtherUser() {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  return currentUser.id === 'dennis'
    ? APP_CONFIG.users.anna
    : APP_CONFIG.users.dennis;
}

// =============================================
// Chat Functions
// =============================================

async function sendMessage(content) {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error('Not logged in');

  const message = {
    sender_id: currentUser.id,
    content: content.trim(),
    created_at: new Date().toISOString()
  };

  const sb = getSupabase();
  if (sb) {
    const { data, error } = await sb
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Fallback: store locally if no Supabase
  return storeMessageLocally(message);
}

async function getMessages(limit = 50) {
  const sb = getSupabase();

  if (sb) {
    const { data, error } = await sb
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  // Fallback: get from local storage
  return getLocalMessages();
}

function subscribeToMessages(callback) {
  const sb = getSupabase();

  if (sb) {
    return sb
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, payload => {
        callback(payload.new);
      })
      .subscribe();
  }

  return null;
}

// =============================================
// Typing Indicator Functions
// =============================================

let typingChannel = null;

function subscribeToTyping(callback) {
  const sb = getSupabase();
  if (!sb) return null;

  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  typingChannel = sb.channel('typing');

  typingChannel
    .on('broadcast', { event: 'typing' }, ({ payload }) => {
      if (payload.user_id !== currentUser.id) {
        callback(payload);
      }
    })
    .subscribe();

  return typingChannel;
}

function sendTypingIndicator(isTyping) {
  const currentUser = getCurrentUser();
  if (!typingChannel || !currentUser) return;

  typingChannel.send({
    type: 'broadcast',
    event: 'typing',
    payload: {
      user_id: currentUser.id,
      user_name: currentUser.name,
      is_typing: isTyping
    }
  });
}

// =============================================
// Presence Functions
// =============================================

let presenceChannel = null;

function subscribeToPresence(callback) {
  const sb = getSupabase();
  if (!sb) return null;

  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  presenceChannel = sb.channel('presence', {
    config: {
      presence: {
        key: currentUser.id
      }
    }
  });

  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
      callback(state);
    })
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
      callback({ join: { key, presences: newPresences } });
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      callback({ leave: { key, presences: leftPresences } });
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await presenceChannel.track({
          user_id: currentUser.id,
          user_name: currentUser.name,
          online_at: new Date().toISOString()
        });
      }
    });

  return presenceChannel;
}

// =============================================
// Local Storage Fallback
// =============================================

function storeMessageLocally(message) {
  const messages = getLocalMessages();
  message.id = Date.now();
  messages.push(message);
  localStorage.setItem('messages', JSON.stringify(messages));

  // Dispatch event for real-time feel in same browser
  window.dispatchEvent(new CustomEvent('newLocalMessage', { detail: message }));

  return message;
}

function getLocalMessages() {
  const messagesStr = localStorage.getItem('messages');
  if (!messagesStr) return [];

  try {
    return JSON.parse(messagesStr);
  } catch {
    return [];
  }
}

// =============================================
// Online Status
// =============================================

async function updateOnlineStatus(isOnline) {
  const sb = getSupabase();
  const currentUser = getCurrentUser();

  if (sb && currentUser) {
    try {
      await sb.from('users').update({
        is_online: isOnline,
        last_seen: new Date().toISOString()
      }).eq('id', currentUser.id);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  }
}

async function getOtherUserStatus() {
  const sb = getSupabase();
  const otherUser = getOtherUser();

  if (sb && otherUser) {
    try {
      const { data } = await sb
        .from('users')
        .select('is_online, last_seen')
        .eq('id', otherUser.username.toLowerCase())
        .single();

      return data;
    } catch (error) {
      return null;
    }
  }

  return null;
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
  updateOnlineStatus(!document.hidden);
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  updateOnlineStatus(false);
});

// Export functions
window.initSupabase = initSupabase;
window.getSupabase = getSupabase;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.getSession = getSession;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getOtherUser = getOtherUser;
window.sendMessage = sendMessage;
window.getMessages = getMessages;
window.subscribeToMessages = subscribeToMessages;
window.subscribeToTyping = subscribeToTyping;
window.sendTypingIndicator = sendTypingIndicator;
window.subscribeToPresence = subscribeToPresence;
window.updateOnlineStatus = updateOnlineStatus;
window.getOtherUserStatus = getOtherUserStatus;
