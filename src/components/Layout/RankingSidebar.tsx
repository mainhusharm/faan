import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RankingUser {
  id: string;
  full_name: string;
  points: number;
  avatar_url?: string;
}

const RankingSidebar: React.FC = () => {
  const [rankings, setRankings] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, points, avatar_url')
        .order('points', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Error fetching rankings:', error);
        // Use mock data if Supabase fails
        setRankings([
          { id: '1', full_name: 'Alex Johnson', points: 1250, avatar_url: '' },
          { id: '2', full_name: 'Sarah Chen', points: 1180, avatar_url: '' },
          { id: '3', full_name: 'Mike Rodriguez', points: 1100, avatar_url: '' },
          { id: '4', full_name: 'Emily Davis', points: 950, avatar_url: '' },
          { id: '5', full_name: 'David Wilson', points: 875, avatar_url: '' },
          { id: '6', full_name: 'Lisa Anderson', points: 800, avatar_url: '' },
          { id: '7', full_name: 'John Smith', points: 750, avatar_url: '' },
          { id: '8', full_name: 'Maria Garcia', points: 700, avatar_url: '' },
          { id: '9', full_name: 'Tom Brown', points: 650, avatar_url: '' },
          { id: '10', full_name: 'Anna Lee', points: 600, avatar_url: '' }
        ]);
      } else {
        setRankings(data || []);
      }
    } catch (error) {
      console.error('Error fetching rankings:', error);
      // Use mock data if there's any error
      setRankings([
        { id: '1', full_name: 'Alex Johnson', points: 1250, avatar_url: '' },
        { id: '2', full_name: 'Sarah Chen', points: 1180, avatar_url: '' },
        { id: '3', full_name: 'Mike Rodriguez', points: 1100, avatar_url: '' },
        { id: '4', full_name: 'Emily Davis', points: 950, avatar_url: '' },
        { id: '5', full_name: 'David Wilson', points: 875, avatar_url: '' },
        { id: '6', full_name: 'Lisa Anderson', points: 800, avatar_url: '' },
        { id: '7', full_name: 'John Smith', points: 750, avatar_url: '' },
        { id: '8', full_name: 'Maria Garcia', points: 700, avatar_url: '' },
        { id: '9', full_name: 'Tom Brown', points: 650, avatar_url: '' },
        { id: '10', full_name: 'Anna Lee', points: 600, avatar_url: '' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <span>Leaderboard</span>
      </h3>
      <div className="space-y-3">
        {rankings.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              {getRankIcon(index + 1)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-gray-500">{user.points} points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingSidebar;