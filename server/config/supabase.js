const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key for backend operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Create Supabase client with anon key for auth operations
const supabaseClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper function to get user from JWT token
const getUserFromToken = async (token) => {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser(token);
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
};

// Middleware to verify user authentication
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await getUserFromToken(token);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Get user details from our users table
    const { data: userDetails, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user details:', error);
      return res.status(500).json({ message: 'Error verifying user' });
    }

    req.user = userDetails;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Middleware to check if user is service provider
const requireServiceProvider = async (req, res, next) => {
  if (!['service_provider', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Service provider access required' });
  }
  next();
};

module.exports = {
  supabaseAdmin,
  supabaseClient,
  authenticateUser,
  requireAdmin,
  requireServiceProvider,
  getUserFromToken
};