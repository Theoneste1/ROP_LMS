# Netlify Deployment Guide

This guide will help you deploy your Next.js application to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. A PostgreSQL database (recommended providers: [Supabase](https://supabase.com), [Neon](https://neon.tech), [Railway](https://railway.app))
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up PostgreSQL Database

Your project uses PostgreSQL. You need an external database for production:

### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the **Connection string** (URI format)
5. Make sure to use the **Connection pooling** URL if available (port 6543)

### Option B: Neon
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string from the dashboard

### Option C: Railway
1. Go to [railway.app](https://railway.app) and create an account
2. Create a new PostgreSQL database
3. Copy the connection string from the database settings

## Step 2: Run Database Migrations

Before deploying, you need to set up your database schema:

```bash
# Set your production DATABASE_URL
export DATABASE_URL="your-postgresql-connection-string"

# Run migrations
npx prisma migrate deploy

# (Optional) Generate Prisma Client
npx prisma generate
```

**Note:** You can also run migrations after deployment using Netlify's build hooks or manually via CLI.

## Step 3: Deploy to Netlify

### Method 1: Deploy via Netlify UI (Recommended for first deployment)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect your Git provider and select your repository

3. **Configure Build Settings**
   - **Build command:** `npm run netlify:build` (already configured in `netlify.toml`)
   - **Publish directory:** `.next` (already configured)
   - Netlify should auto-detect these from `netlify.toml`

4. **Set Environment Variables**
   Click **"Show advanced"** → **"New variable"** and add:
   
   ```
   DATABASE_URL=your-postgresql-connection-string
   NEXTAUTH_SECRET=generate-a-random-secret-here
   NEXTAUTH_URL=https://your-site-name.netlify.app
   ```
   
   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   
   **Important:** After your first deployment, update `NEXTAUTH_URL` to your actual Netlify domain.

5. **Deploy**
   - Click **"Deploy site"**
   - Wait for the build to complete
   - Your site will be live at `https://your-site-name.netlify.app`

### Method 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**
   ```bash
   # Initialize (first time only)
   netlify init
   
   # Deploy
   netlify deploy --prod
   ```

## Step 4: Configure Environment Variables

After deployment, make sure all environment variables are set in Netlify:

1. Go to **Site settings** → **Environment variables**
2. Add/verify these variables:

   | Variable | Description | Example |
   |----------|-------------|---------|
   | `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
   | `NEXTAUTH_SECRET` | Secret for NextAuth.js | Random 32+ character string |
   | `NEXTAUTH_URL` | Your site URL | `https://your-site.netlify.app` |
   | `RESEND_API_KEY` | (Optional) For contact form emails | Your Resend API key |

3. **Redeploy** after adding environment variables

## Step 5: Run Database Migrations (Production)

After your first deployment, run migrations on your production database:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-postgresql-connection-string"

# Deploy migrations
npx prisma migrate deploy
```

Or use Netlify's build hook to run migrations automatically during deployment.

## Step 6: Verify Deployment

1. Visit your Netlify URL: `https://your-site-name.netlify.app`
2. Test authentication (sign up/login)
3. Test API routes
4. Check Netlify function logs: **Functions** tab in Netlify dashboard

## Troubleshooting

### Build Fails

**Error: Prisma Client not generated**
- Solution: The `netlify:build` script should handle this automatically
- Check build logs to ensure `prisma generate` runs successfully

**Error: Database connection failed**
- Verify `DATABASE_URL` is set correctly in Netlify environment variables
- Ensure your database allows connections from Netlify's IPs
- For Supabase: Check that Row Level Security (RLS) is disabled or properly configured

**Error: API routes timeout**
- Netlify free tier has 10-second timeout
- Upgrade to paid plan for 26-second timeout
- Optimize your API routes to complete faster

### Runtime Errors

**NextAuth.js not working**
- Verify `NEXTAUTH_URL` matches your actual Netlify domain
- Check `NEXTAUTH_SECRET` is set
- Review NextAuth.js logs in Netlify function logs

**Database queries failing**
- Check database connection string format
- Verify database is accessible from internet
- Check Prisma Client is generated correctly

### Performance Issues

- Enable Netlify's CDN caching (already configured in `netlify.toml`)
- Optimize images using Next.js Image component
- Consider upgrading to Netlify Pro for better performance

## Post-Deployment Checklist

- [ ] Database migrations deployed
- [ ] Environment variables configured
- [ ] `NEXTAUTH_URL` matches actual domain
- [ ] Authentication working
- [ ] API routes responding
- [ ] Database queries working
- [ ] Static assets loading correctly
- [ ] Custom domain configured (optional)

## Custom Domain Setup

1. Go to **Domain settings** → **Add custom domain**
2. Follow Netlify's DNS configuration instructions
3. Update `NEXTAUTH_URL` to match your custom domain
4. Redeploy

## Continuous Deployment

Netlify automatically deploys when you push to your main branch. To deploy from other branches:

1. Go to **Site settings** → **Build & deploy** → **Branch deploys**
2. Enable branch deploys for preview branches

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/options#nextauth_url)

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check Netlify function logs
3. Review environment variables
4. Verify database connectivity

---

**Note:** Netlify's free tier has limitations:
- 10-second function timeout (upgrade to Pro for 26 seconds)
- 100GB bandwidth per month
- Limited build minutes

For production use, consider upgrading to Netlify Pro.
