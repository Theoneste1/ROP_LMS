# Netlify Quick Start Guide

## 🚀 Quick Deployment Steps

### 1. Install Netlify Plugin (if not already installed)
```bash
npm install --save-dev @netlify/plugin-nextjs
```

### 2. Set Up PostgreSQL Database
Choose one:
- **Supabase**: https://supabase.com (Free tier available)
- **Neon**: https://neon.tech (Serverless PostgreSQL)
- **Railway**: https://railway.app

### 3. Run Database Migrations
```bash
export DATABASE_URL="your-postgresql-connection-string"
npx prisma migrate deploy
```

### 4. Deploy to Netlify

**Option A: Via Netlify Dashboard**
1. Push code to GitHub/GitLab/Bitbucket
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your Git provider
5. Netlify will auto-detect settings from `netlify.toml`

**Option B: Via Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 5. Set Environment Variables

In Netlify Dashboard → Site settings → Environment variables:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-site-name.netlify.app` |

### 6. Redeploy

After setting environment variables, trigger a new deployment.

## ✅ Verification Checklist

- [ ] Database migrations deployed
- [ ] Environment variables set
- [ ] Site builds successfully
- [ ] Authentication works
- [ ] API routes respond
- [ ] Database queries work

## 📚 Full Documentation

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for detailed instructions.

## ⚠️ Important Notes

- **Free Tier Limits**: 10-second function timeout
- **Upgrade to Pro**: For 26-second timeout and better performance
- **Database**: Must be external (PostgreSQL) - SQLite won't work
- **NEXTAUTH_URL**: Update after first deployment with actual domain

## 🆘 Troubleshooting

**Build fails?**
- Check build logs in Netlify dashboard
- Verify `DATABASE_URL` is set correctly
- Ensure Prisma generates: `npx prisma generate`

**API routes timeout?**
- Optimize database queries
- Upgrade to Netlify Pro for longer timeout
- Consider caching strategies

**Database connection fails?**
- Verify `DATABASE_URL` format
- Check database allows external connections
- For Supabase: Disable RLS or configure properly
