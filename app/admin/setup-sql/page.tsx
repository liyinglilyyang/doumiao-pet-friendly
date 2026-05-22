'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, CheckCheck } from 'lucide-react'

const SQL = `-- ================================================
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

-- 5. 把我的邮箱设为 admin（如果账号已存在则更新）
insert into profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'liyingyang4155@gmail.com'
on conflict (id) do update
  set role = 'admin', email = excluded.email;

-- 6. 验证结果（运行后看这行的输出）
select u.email, p.role, p.created_at
from auth.users u
left join profiles p on p.id = u.id
where u.email = 'liyingyang4155@gmail.com';`

export default function SetupSqlPage() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(SQL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#FDFAF4] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/login" className="text-sm text-[#C07A4E] hover:underline mb-6 inline-block">
          ← 返回登录
        </Link>

        <h1 className="font-bold text-[#1E1209] text-xl mb-2">管理员初始化 SQL</h1>
        <p className="text-sm text-[#A07855] mb-6 leading-relaxed">
          复制以下 SQL，在{' '}
          <strong>Supabase Dashboard → SQL Editor → New query</strong>{' '}
          中粘贴并点击 <strong>Run</strong>。只需执行一次。
        </p>

        <div className="bg-[#1E1209] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-xs text-white/50 font-mono">SQL</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
            >
              {copied ? <CheckCheck size={13} className="text-emerald-400" /> : <Copy size={13} />}
              {copied ? '已复制' : '复制'}
            </button>
          </div>
          <pre className="px-4 py-4 text-[11px] text-[#D4C5A9] leading-relaxed overflow-x-auto whitespace-pre font-mono">
            {SQL}
          </pre>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-1.5">
          <p className="text-[13px] font-semibold text-blue-900">运行后你会看到：</p>
          <ul className="text-[12px] text-blue-800 space-y-1 leading-relaxed list-disc pl-4">
            <li>最后一行 select 输出你的邮箱和 role = admin</li>
            <li>然后回到登录页，重新输入账号密码</li>
            <li>如果 Auth Error 提示 "Email not confirmed"，需要先在 Supabase 验证邮箱或关闭邮件确认</li>
          </ul>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5">
          <p className="text-[13px] font-semibold text-amber-900">关于邮件验证（如果登录提示 Email not confirmed）</p>
          <p className="text-[12px] text-amber-800 leading-relaxed">
            Supabase Dashboard → Authentication → Providers → Email → 关闭 <strong>Confirm email</strong>，
            然后重新注册账号，或在 Authentication → Users 里手动 Confirm 你的账号。
          </p>
        </div>
      </div>
    </div>
  )
}
