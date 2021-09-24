interface AdminType {
  admin_id: string | null;
}

interface NoticeType {
  id: string;
  title: string;
  body: string;
  thumbnail?: string;
  tags: string[];
  created_at: string;
}
