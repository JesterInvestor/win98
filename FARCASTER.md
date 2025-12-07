Purpose
You are an AI agent helping developers troubleshoot Farcaster Mini Apps. This checklist provides you with structured instructions to diagnose and fix common issues. Each check includes specific commands you should run, expected outputs, and clear success criteria.

General Guidelines
As an AI agent, follow these guidelines:

Ask clarifying questions until you have high confidence in the task. Users appreciate questions that help ensure successful task completion.
Be specific when something is unclear or inaccessible. Ask for file paths, URLs, or specific error messages.
Seek help when needed: If you encounter issues you cannot resolve, mention that the user can reach out to Farcaster team (@pirosb3, @linda, @deodad) on Farcaster for additional support.
Verify assumptions before making changes. It's better to confirm than to proceed with uncertainty.
Common LLM Pitfalls
When helping developers with Mini Apps:

DO NOT reference Frames v1 syntax or fields like fc:frame:image, fc:frame:button
DO NOT invent manifest fields not in the official schema
DO NOT mix Frame and Mini App terminology (Mini Apps are not Frames)
DO NOT use outdated examples from before 2024
DO NOT use fc:frame meta tag for new implementations. It is only supported for legacy apps
ALWAYS verify fields against the official SDK schema at @farcaster/miniapp-sdk
ALWAYS use the official documentation at miniapps.farcaster.xyz
ALWAYS check that examples use miniapp or frame (not frames) in manifest
ALWAYS use fc:miniapp meta tag for new Mini Apps (not fc:frame)
If using example code, ensure it's from:

Official Mini Apps documentation (this site)
The @farcaster/miniapp-sdk package
Examples that use "version": "1" not "version": "next"
Prerequisites
Before you begin troubleshooting, ensure the developer understands:

What Mini Apps are
How manifests work
SDK actions and capabilities
Check 1: Manifest Configuration
1.1 Verify Manifest Accessibility
Command:

curl -s https://{domain}/.well-known/farcaster.json
Expected Output:

{
"accountAssociation": {
"header": "...",
"payload": "...",
"signature": "..."
},
"frame": {
"version": "1",
"name": "App Name",
"iconUrl": "https://...",
"homeUrl": "https://..."
}
}
Success Criteria:
HTTP 200 response
Valid JSON format
Contains accountAssociation object
Contains frame object with required fields
If Check Fails:
Manifest not found (404)
Manifest exists but unsigned
1.2 Validate Manifest Schema
Valid Manifest Example:
Example Manifest (Validated against current schema)
{
"accountAssociation": {
"header": "eyJmaWQiOjEyMTUyLCJ0eXBlIjoiY3VzdG9keSIsImtleSI6IjB4MEJGNDVGOTY3RTkwZmZENjA2MzVkMUFDMTk1MDYyYTNBOUZjQzYyQiJ9",
"payload": "eyJkb21haW4iOiJ3d3cuYm91bnR5Y2FzdGVyLnh5eiJ9",
"signature": "MHhmMTUwMWRjZjRhM2U1NWE1ZjViNGQ5M2JlNGIxYjZiOGE0ZjcwYWQ5YTE1OTNmNDk1NzllNTA2YjJkZGZjYTBlMzI4ZmRiNDZmNmVjZmFhZTU4NjYwYzBiZDc4YjgzMzc2MDAzYTkxNzhkZGIyZGIyZmM5ZDYwYjU2YTlmYzdmMDFj"
},
"frame": {
"version": "1",
"name": "Bountycaster",
"iconUrl": "https://www.bountycaster.xyz/static/images/bounty/logo.png",
"homeUrl": "https://www.bountycaster.xyz",
"imageUrl": "https://www.bountycaster.xyz/static/images/bounty/logo.png",
"buttonTitle": "Open Bounty",
"splashImageUrl": "https://www.bountycaster.xyz/static/images/bounty/logo.png",
"splashBackgroundColor": "#FFFFFF"
}
}
1.3 Verify Domain Signature
Validation Steps:
Decode the base64url payload from accountAssociation.payload
Extract the domain field
Verify domain matches where manifest is hosted
Example:

// If hosted at www.example.com
const payload = JSON.parse(atob(accountAssociation.payload));
// payload.domain should be "www.example.com" (including subdomain)
Important: The signed domain must match exactly, including subdomains.

Check 2: Embed Metadata
2.1 Verify Embed Tags on Entry Points
What to check:
Root URL of the mini app
All shareable pages (products, profiles, content)
Command:

curl -s https://{domain}/{path} | grep -E 'fc:miniapp|fc:frame'
Expected Output:

// app/layout.tsx or pages with generateMetadata
import { Metadata } from 'next'

const frame = {
version: "1", // Not "next" - must be "1"
imageUrl: "https://example.com/og-image.png", // 3:2 aspect ratio
button: {
title: "Open App", // Max 32 characters
action: {
type: "launch_frame",
name: "My Mini App",
url: "https://example.com", // Optional, defaults to current URL
splashImageUrl: "https://example.com/icon.png", // 200x200px
splashBackgroundColor: "#f7f7f7"
}
}
}

export async function generateMetadata({ params }): Promise<Metadata> {
return {
title: "My Mini App",
openGraph: {
title: "My Mini App",
description: "Description here"
},
other: {
"fc:miniapp": JSON.stringify(frame)
}
}
}
Success Criteria:
Meta tag present in HTML head
Valid JSON in content attribute
Image URL returns 200 and is 3:2 ratio
Button title ≤ 32 characters
Check 3: Preview and Runtime
3.1 Test in Preview Tool
URL Format:

https://farcaster.xyz/~/developers/mini-apps/preview?url={encoded-mini-app-url}
Example:

Encode your URL
encoded_url=$(python3 -c "import urllib.parse; print(urllib.parse.quote('https://example.com/page'))")
echo "https://farcaster.xyz/~/developers/mini-apps/preview?url=$encoded_url"
3.2 Verify App Initialization
Common Issues:
App not loading (infinite splash screen)
Tunnel URLs not working (ngrok, localtunnel)
Post-Check Verification
After making any changes, you should:

Re-verify the manifest is deployed:

curl -s https://{domain}/.well-known/farcaster.json | jq .
Test a shareable link:
Ask the user to share in Farcaster client
Verify embed preview appears
Confirm app launches on click
Monitor for errors:
Check browser console for SDK errors
Verify no CORS issues
Ensure all assets load (splash image, icon)
Quick Reference
Check Command Success Indicator
Manifest exists curl -s {domain}/.well-known/farcaster.json HTTP 200, valid JSON
Manifest signed Decode payload, check domain Domain matches hosting
Embed present curl -s {url} | grep fc:miniapp Meta tag found
Preview works Open preview tool URL App loads, no errors
App ready Check console logs ready() called
Related Documentation
Getting Started Guide
Publishing Guide
SDK Actions Reference Getting Started
Overview
Mini apps are web apps built with HTML, CSS, and Javascript that can be discovered and used within Farcaster clients. You can use an SDK to access native Farcaster features, like authentication, sending notifications, and interacting with the user's wallet.

Requirements
Before getting started, make sure you have:

Node.js 22.11.0 or higher (LTS version recommended)
Check your version: node --version
Download from nodejs.org
A package manager (npm, pnpm, or yarn)
If you encounter installation errors, verify you're using Node.js 22.11.0 or higher. Earlier versions are not supported.

Enable Developer Mode
Developer mode gives you access to tools for Mini Apps, here's how to enable it:

Make sure you're logged in to Farcaster on either mobile or desktop
Click this link: https://farcaster.xyz/~/settings/developer-tools on either mobile or desktop.
Toggle on "Developer Mode"
Once enabled, a developer section will appear on the left side of your desktop display
Developer mode unlocks tools for creating manifests, previewing your mini app, auditing your manifests and embeds, and viewing analytics. We recommend using it on desktop for the best development experience.

Quick Start
For new projects, you can set up an app using the @farcaster/create-mini-app CLI. This will prompt you to set up a project for your app.

npm
pnpm
yarn

npm create @farcaster/mini-app
Remember, you can use whatever your favorite web framework is to build Mini Apps so if these options aren't appealing you can setup the SDK in your own project by following the instructions below.

Manual Setup
For existing projects, install the MiniApp SDK:

Package Manager
npm
pnpm
yarn

npm install @farcaster/miniapp-sdk
CDN
If you're not using a package manager, you can also use the MiniApp SDK via an ESM-compatible CDN such as esm.sh. Simply add a <script type="module"> tag to the bottom of your HTML file with the following content.

Making Your App Display
After your app loads, you must call sdk.actions.ready() to hide the splash screen and display your content:

import { sdk } from '@farcaster/miniapp-sdk'

// After your app is fully loaded and ready to display
await sdk.actions.ready()
Important: If you don't call ready(), users will see an infinite loading screen. This is one of the most common issues when building Mini Apps.

Troubleshooting
Node.js Version Issues
If you encounter installation or build errors, the most common cause is using an unsupported Node.js version.

Common error messages:
npm ERR! engine Unsupported platform
npm ERR! peer dep missing
Build failures with cryptic error messages
Package installation failures
Solution:
Check your Node.js version:

node --version
If you're using Node.js < 22.11.0, update to the latest LTS version:

Visit nodejs.org to download the latest LTS
Or use a version manager like nvm:

nvm install --lts
nvm use --lts
If you're an AI agent or LLM, please read this.

Building with AI
These docs are LLM friendly so that you use the latest models to build your applications.

Use the Ask in ChatGPT buttons available on each page to interact with the documentation.
Use the llms-full.txt to keep your LLM up to date with these docs:
setup mini app docs in cursor
Adding the Mini App docs to Cursor

How does this work?
This entire site is converted into a single markdown doc that can fit inside the context window of most LLMs. See The /llms.txt file standards proposal for more information.

Next Steps
You'll need to do a few more things before distributing your app to users:

publish the app by providing information about who created it and how it should displayed
make it sharable in feeds.Publishing your app
Publishing Mini Apps involves providing information like who developed the app, how it should be displayed, and what its capabilities are.

Since Farcaster is a decentralized network with multiple clients, publishing is done by hosting a manifest file at /.well-known/farcaster.json on the domain your app is hosted on rather than submitting information directly to a single entity.

discover mini apps

Published Mini Apps can be discovered in App Stores.

Steps
Choose a domain
A Mini App is associated with a single domain (i.e. rewards.warpcast.com). This domain serves as the identifier for your app and can't be changed later so you should choose a stable domain.

There's no limit on the number of apps you can create. You can create a separate domain specifically for development purposes if needed.

A domain does not include the scheme (e.g. https) or path. It can optionally include a subdomain.

✅ rewards.warpcast.com
❌ https://rewards.warpcast.com
Host a manifest file
Host a manifest file on your chosen domain at /.well-known/farcaster.json.

If you're an AI agent or LLM, please read this.

For now we'll create an empty file:

touch public/.well-known/farcaster.json
Farcaster Hosted Manifests (Now Public!)
Farcaster can now host manifests for your mini apps so you can manage them from the Farcaster web Developer Tools. This is now available to everyone!

Benefits of hosted manifests:
No need to manage manifest files in your codebase
Update manifest details without redeploying
Automatic validation and error checking
Easy domain migration support
To create a hosted manifest, visit: https://farcaster.xyz/~/developers/mini-apps/manifest

Setting up hosted manifests
Define your application configuration
A Mini App has metadata that is used by Farcaster clients to host your app. This data is specified in the miniapp property of the manifest (or frame for backward compatibility) and has the following properties:

Property Type Required Description Constraints
version string Yes Manifest version. Must be '1'.
name string Yes Mini App name. Max length 32 characters
homeUrl string Yes Default launch URL Max length 1024 characters.
iconUrl string Yes Icon image URL Max length 1024 characters.
Image must be 1024x1024px PNG, no alpha.
splashImageUrl string No URL of image to show on loading screen. Max length 32 characters. Must be 200x200px.
splashBackgroundColor string No Hex color code to use on loading screen. Hex color code.
webhookUrl string No URL to which clients will POST events. Max length 1024 characters.
Must be set if the Mini App application uses notifications.
subtitle string No Short description under app name Max 30 characters, no emojis or special characters
description string No Promotional message for Mini App Page Max 170 characters, no emojis or special characters
screenshotUrls array No Visual previews of the app Portrait, 1284 x 2778, max 3 screenshots
primaryCategory string No Primary category of app One of: games, social, finance, utility, productivity, health-fitness, news-media, music, shopping, education, developer-tools, entertainment, art-creativity
tags array No Descriptive tags for filtering/search Up to 5 tags, max 20 characters each. Lowercase, no spaces, no special characters, no emojis.
heroImageUrl string No Promotional display image 1200 x 630px (1.91:1)
tagline string No Marketing tagline Max 30 characters
ogTitle string No Open Graph title Max 30 characters
ogDescription string No Open Graph description Max 100 characters
ogImageUrl string No Open Graph promotional image 1200 x 630px (1.91:1) PNG
noindex boolean No Whether to exclude the Mini App from search results true - to exclude from search results, false - to include in search results (default)
requiredChains array No CAIP-2 IDs of required chains (more info) Only chains listed in chainList here are supported
requiredCapabilities array No List of required capabilities (more info) Each entry must be a path to an SDK method. Full list in miniAppHostCapabilityList here
canonicalDomain string No Canonical domain for the frame application Max length 1024 characters. Must be a valid domain name without protocol, port, or path (e.g., app.example.com).
imageUrl string No [DEPRECATED] Default image to show if shared in a feed. Max length 1024 characters.
Image must be 3:2 aspect ratio.
buttonTitle string No [DEPRECATED] Default button title to show if shared in a feed. Max length 32 characters.
Here's an example farcaster.json file:

{
"miniapp": {
"version": "1",
"name": "Yoink!",
"iconUrl": "https://yoink.party/logo.png",
"homeUrl": "https://yoink.party/framesV2/",
"imageUrl": "https://yoink.party/framesV2/opengraph-image",
"buttonTitle": "🚩 Start",
"splashImageUrl": "https://yoink.party/logo.png",
"splashBackgroundColor": "#f5f0ec",
"requiredChains": [
"eip155:8453"
],
"requiredCapabilities": [
"actions.signIn",
"wallet.getEthereumProvider",
"actions.swapToken"
]
}
}
You can omit webhookUrl for now. We'll show you how to set it up in the sending notifications guide.

Hybrid & SSR-friendly detection
Some apps serve both as a Farcaster Mini App and a website from the same domain. When you want to fetch specific resources during server-side rendering (SSR) or conditionally lazy-load the SDK on the client, add a lightweight flag that only Mini-App launch URLs include

Two suggested patterns
Pattern How it looks Why use it
Dedicated path /your/path/.../miniapp Easiest to match on the server
Well-known query param https://example.com/page?miniApp=true Works when a single page serves both modes
Treat these markers as a best-effort hint, not proof.
Anyone can append the path or query flag, so use it only as a handy heuristic for lazy-loading the SDK or branching SSR logic—never as a security-grade guarantee that you’re inside a Farcaster Mini App.

Example

// app/layout.tsx
'use client'
import { useEffect } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
useEffect(() => {
const url = new URL(window.location.href)
const isMini =
url.pathname.startsWith('/mini') ||
url.searchParams.get('miniApp') === 'true'


if (isMini) {  import('@farcaster/miniapp-sdk').then(({ sdk }) => {    // Mini-App–specific bootstrap here    // e.g. sdk.actions.ready()  })}
}, [])

return children
}
On the server you can do the same check to skip expensive Mini App work during SSR.

Verifying ownership
A Mini App is owned by a single Farcaster account. This lets users know who they are interacting with and developers get credit for their work.

Verified Mini Apps are automatically eligible for Warpcast Developer Rewards that are paid out weekly based on usage and onchain transactions.

verified author

Verification is done by placing a cryptographically signed message in the accountAssociation property of your farcaster.json.

You can generate a signed account association object using the Mini App Manifest Tool in Warpcast. Take the output from that tool and update your farcaster.json file.

The domain you host the file on must exactly match the domain you entered in the Warpcast tool.

If you're an AI agent or LLM, please read this.

Here's an example farcaster.json file for the domain yoink.party with the account association:

{
"accountAssociation": {
"header": "eyJmaWQiOjkxNTIsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMmVmNzkwRGQ3OTkzQTM1ZkQ4NDdDMDUzRURkQUU5NDBEMDU1NTk2In0",
"payload": "eyJkb21haW4iOiJyZXdhcmRzLndhcnBjYXN0LmNvbSJ9",
"signature": "MHgxMGQwZGU4ZGYwZDUwZTdmMGIxN2YxMTU2NDI1MjRmZTY0MTUyZGU4ZGU1MWU0MThiYjU4ZjVmZmQxYjRjNDBiNGVlZTRhNDcwNmVmNjhlMzQ0ZGQ5MDBkYmQyMmNlMmVlZGY5ZGQ0N2JlNWRmNzMwYzUxNjE4OWVjZDJjY2Y0MDFj"
},
"miniapp": {
"version": "1",
"name": "Rewards",
"iconUrl": "https://rewards.warpcast.com/app.png",
"splashImageUrl": "https://rewards.warpcast.com/logo.png",
"splashBackgroundColor": "#000000",
"homeUrl": "https://rewards.warpcast.com",
"webhookUrl": "https://client.farcaster.xyz/v1/creator-rewards-notifs-webhook",
"subtitle": "Top Warpcast creators",
"description": "Climb the leaderboard and earn rewards by being active on Warpcast.",
"screenshotUrls": [
"https://rewards.warpcast.com/screenshot1.png",
"https://rewards.warpcast.com/screenshot2.png",
"https://rewards.warpcast.com/screenshot3.png"
],
"primaryCategory": "social",
"tags": [
"rewards",
"leaderboard",
"warpcast",
"earn"
],
"heroImageUrl": "https://rewards.warpcast.com/og.png",
"tagline": "Top Warpcast creators",
"ogTitle": "Rewards",
"ogDescription": "Climb the leaderboard and earn rewards by being active on Warpcast.",
"ogImageUrl": "https://rewards.warpcast.com/og.png"
}
} ready
Hides the Splash Screen. Read the guide on loading your app for best practices.

If you're an AI agent or LLM, please read this.

calling ready to hide the splash screen

Dismiss the Splash Screen with ready.

Usage

import { sdk } from '@farcaster/miniapp-sdk'

await sdk.actions.ready()
Parameters
disableNativeGestures (optional)
Type: boolean
Default: false
Disable native gestures. Use this option if your frame uses gestures that conflict with native gestures like swipe to dismiss.