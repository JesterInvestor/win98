# Deployment Guide for WIN98 Emulator

This guide covers deploying the WIN98 Windows 98 emulator with Web3 integration to Vercel.

## Prerequisites

Before deploying, ensure you have:
- A GitHub account
- A Vercel account (free tier works)
- A WalletConnect Project ID from [Reown Cloud](https://cloud.reown.com)

## Step 1: Get a WalletConnect Project ID

1. Visit [https://cloud.reown.com](https://cloud.reown.com)
2. Sign up or log in
3. Create a new project
4. Name it "WIN98 Emulator" (or your preferred name)
5. Copy your Project ID - you'll need this for deployment

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `win98` repository

3. **Configure Environment Variables**
   - In the "Environment Variables" section, add:
     - Name: `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
     - Value: Your WalletConnect Project ID from Step 1
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-3 minutes)
   - Your site will be live at `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Set Environment Variable**
   ```bash
   vercel env add NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
   # Paste your Project ID when prompted
   ```

4. **Deploy**
   ```bash
   vercel --prod
   ```

## Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

## Step 4: Update Farcaster Manifest

If you're using a custom domain, update the URLs in:
- `public/.well-known/farcaster.json`
- Replace `https://win98.vercel.app` with your actual domain

Then redeploy:
```bash
git add public/.well-known/farcaster.json
git commit -m "Update Farcaster manifest with production URL"
git push
```

Vercel will automatically redeploy.

## Step 5: Test Your Deployment

1. Visit your deployed URL
2. Click "Connect Wallet"
3. Test wallet connection
4. Try the token claim timer
5. Enter the Windows 98 emulator
6. Test applications and games

## Troubleshooting

### Build Fails

**Issue**: Build fails with dependency errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Wallet Connection Doesn't Work

**Issue**: Wallet modal doesn't appear
**Solution**:
1. Verify your Project ID is set correctly in Vercel environment variables
2. Check browser console for errors
3. Ensure the Project ID is from [cloud.reown.com](https://cloud.reown.com)

### Mobile Display Issues

**Issue**: UI doesn't look right on mobile
**Solution**:
- Clear browser cache
- The app is optimized for mobile, but some games work better on desktop
- Try landscape orientation on mobile

### Farcaster Frame Not Working

**Issue**: Can't launch from Farcaster
**Solution**:
1. Verify `public/.well-known/farcaster.json` exists
2. Check that all URLs in the manifest point to your production domain
3. Test the JSON file is accessible: `https://your-domain.vercel.app/.well-known/farcaster.json`

## Performance Optimization

Vercel automatically provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Image optimization
- ✅ Edge caching
- ✅ DDoS protection

## Monitoring

Monitor your deployment:
1. **Vercel Dashboard**: View analytics, logs, and performance
2. **Vercel Analytics**: Enable for visitor insights (optional, paid)
3. **Vercel Speed Insights**: Monitor Core Web Vitals

## Environment Variables

Required:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your Reown/WalletConnect project ID

Optional (for future features):
- `NEXT_PUBLIC_CONTRACT_ADDRESS`: Smart contract address for $WIN98 token
- `NEXT_PUBLIC_CHAIN_ID`: Default chain ID (8453 for Base, 1 for mainnet)

## Updating Your Deployment

To update:
1. Make changes locally
2. Commit and push to GitHub
3. Vercel automatically redeploys on push
4. Monitor deployment in Vercel dashboard

## Production Checklist

Before going live:
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured (if using)
- [ ] Farcaster manifest updated with production URLs
- [ ] Wallet connection tested on production
- [ ] Mobile responsiveness verified
- [ ] All games and applications work
- [ ] Token timer tested
- [ ] README updated with live URL

## Security Best Practices

1. **Never commit `.env` files** - Use Vercel environment variables
2. **Use HTTPS only** - Vercel provides this automatically
3. **Keep dependencies updated** - Run `npm audit fix` regularly
4. **Monitor for vulnerabilities** - Check Vercel security alerts

## Support

Need help?
- **GitHub Issues**: [https://github.com/JesterInvestor/win98/issues](https://github.com/JesterInvestor/win98/issues)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **Reown Docs**: [https://docs.reown.com](https://docs.reown.com)

## Cost

- **Vercel Free Tier**: 
  - 100GB bandwidth/month
  - Unlimited deployments
  - Custom domains
  - Perfect for personal projects

- **Upgrade if needed**:
  - More bandwidth
  - Team collaboration
  - Advanced analytics
  - Priority support

---

**Happy deploying! 🚀**
