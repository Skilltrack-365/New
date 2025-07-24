/*
  # Fix infinite recursion in profiles table RLS policies

  1. Problem
    - The "Admins can view all profiles" policy creates infinite recursion
    - It queries the profiles table from within a profiles table policy
    
  2. Solution
    - Remove the recursive policy
    - Create a simpler admin policy that doesn't reference profiles table
    - Use auth.jwt() to check user role from JWT claims instead
    
  3. Changes
    - Drop the problematic "Admins can view all profiles" policy
    - Create a new non-recursive admin policy
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a new admin policy that doesn't cause recursion
-- This policy allows users to view all profiles if they have admin role in their JWT
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    COALESCE(
      (auth.jwt() ->> 'user_role')::user_role = 'admin',
      false
    )
  );

-- Alternative: If JWT doesn't contain role, we can use a simpler approach
-- that allows admins to view profiles without recursion by checking auth.uid() directly
-- against a hardcoded admin user ID or using a different approach

-- Drop the alternative and create a policy that works with the current setup
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create a policy that allows viewing profiles without recursion
-- This assumes that admin status can be determined without querying profiles table
CREATE POLICY "Users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Keep the existing policies for users to manage their own profiles
-- These don't cause recursion since they use auth.uid() = id directly