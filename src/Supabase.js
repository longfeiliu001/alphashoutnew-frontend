import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://pyeiplmxftswzknpldgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWlwbG14ZnRzd3prbnBsZGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODU3NTQsImV4cCI6MjA2ODM2MTc1NH0.5ulg0h3ZQ-Rd5PMmxN1S4P0ulfZtAg2VjOjJxZpSvBQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SupabaseConnection() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Check if user is logged in on component mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Sign up function
  const signUp = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      alert('Check your email for verification link!');
    } catch (error) {
      alert(error.message);
    }
  };

  // Sign in function
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  // Sign out function
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error signing out:', error);
  };

  // Fetch data from a table (example: 'items' table)
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('items')//.from('items')
        .select('*')
     .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(data || []);
    } catch (error) {
     // console.error('Error fetching data:', error);
      alert(error.message);
    }
  };

  // Insert new item
  const insertItem = async () => {
    if (!newItem.trim()) return;

    try {
      const { error } = await supabase
        .from('items')
        .insert([{ 
          name: newItem,
          user_id: user.id 
        }]);
      
      if (error) throw error;
      setNewItem('');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error inserting item:', error);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Supabase Auth</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={signIn}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={signUp}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Welcome, {user.email}!</h1>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>User ID: {user.id}</p>
          <p>Last sign in: {new Date(user.last_sign_in_at).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Database Operations</h2>
        
        <div className="mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new item"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={insertItem}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Items</h3>
            <button
              onClick={fetchData}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm"
            >
              Refresh
            </button>
          </div>
          
          {data.length === 0 ? (
            <p className="text-gray-500">No items found. Add some items above!</p>
          ) : (
            <div className="space-y-2">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                >
                  <span>{item.name}</span>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}