-- ================================================
-- 豆苗管理员初始化 SQL
-- 在 Supabase Dashboard → SQL Editor 中运行
-- ================================================

-- 1. 创建 profiles 表
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

-- 2. 开启 RLS
alter table profiles enable row level security;

-- 3. 允许登录用户读取自己的 profile（登录时角色验证用）
drop policy if exists "Users can read own profile" on profiles;
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- 4. 新用户注册后自动创建 profile（触发器）
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- 5. 把 liyingyang4155@gmail.com 设为 admin
--    如果账号已存在则更新；如果还没注册则等注册后再运行一次
insert into profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'liyingyang4155@gmail.com'
on conflict (id) do update
  set role = 'admin', email = excluded.email;

-- 6. 验证（运行后检查这行输出 role = admin）
select u.email, p.role, p.created_at
from auth.users u
left join profiles p on p.id = u.id
where u.email = 'liyingyang4155@gmail.com';
