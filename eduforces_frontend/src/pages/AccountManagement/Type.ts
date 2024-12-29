export interface AccountRowProps {
  account_id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  avatar_path: string;
  elo_rating: number;
  last_active: {
    Time: string;
    Valid: boolean;
  };
  school: string;
  gold_amount: string;
  is_deactivated: boolean;
}
