# AmazeMend Website

Static website package for `amazemend.com`, focused on AmazeMend Video Repair for Windows.

## Included pages

- `index.html`
- `video-repair.html`
- `download.html`
- `pricing.html`
- `support.html`
- `privacy-policy.html`
- `terms.html`
- `404.html`
- `robots.txt`
- `sitemap.xml`

## Structure

- `assets/css/style.css` - all styling
- `assets/js/config.js` - brand, pricing, URLs, contact data, release metadata
- `assets/js/site.js` - UI interactions, config injection, download and checkout button handling
- `assets/img/*.svg` - current product illustrations

## Current Brand And Pricing

- Brand: AmazeMend
- Domain: `amazemend.com`
- Product: AmazeMend Video Repair for Windows
- 1-month license: `$30.95`
- 1-year license: `$60.95`
- Lifetime license: `$75.95`

## Launch Checklist

1. Upload the Windows installer and set `downloadUrl` in `assets/js/config.js`.
2. Connect Paddle checkout by setting `paddle.clientToken` and plan price IDs in `assets/js/config.js`.
3. Connect the license client/server activation flow.
4. Confirm the support and sales mailboxes:
   - `support@amazemend.com`
   - `sales@amazemend.com`
5. Confirm that the legal operator name and contact address shown in the legal pages match the merchant account before public launch.

## Recommended Deployment Mapping

- `amazemend.com` - Cloudflare Pages for this static site
- `download.amazemend.com` - Cloudflare R2 or another installer hosting endpoint
- `api.amazemend.com` - Cloudflare Workers + D1 for license activation and Paddle webhooks

## Deploy

Deploy the static site to Cloudflare Pages:

```powershell
.\deploy.ps1 -ProjectName amazemend
```

Update the Windows installer URL and deploy in one command:

```powershell
.\deploy.ps1 -ProjectName amazemend -DownloadUrl "https://download.amazemend.com/installers/AmazeMendSetup-1.0.0.exe"
```

If Paddle values still contain placeholders and you only want to test Pages
deployment, pass `-SkipPlaceholderCheck`.

## Installer Download Flow

The installer should be built by the Qt client package script, uploaded to a
download host such as Cloudflare R2, then written to `downloadUrl` in
`assets/js/config.js`. The website's Free Download buttons use that URL.

From the client project:

```powershell
cd ..\AmazeMend\qt_mp4_repair_client
.\publish-installer.ps1 -AppVersion 1.0.0 -Bucket amazemend-downloads -PublicBaseUrl "https://download.amazemend.com" -DeployWebsite
```

## Notes

- This is a static front-end package.
- Windows downloads use the configured installer URL, and paid plans open Paddle Checkout.
- Support requests use the public support email address; the site does not display a non-functional web form.
