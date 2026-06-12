# Umphrey's McGee Tabs

A static archive of Umphrey's McGee guitar tabs. The site is generated from the
plain text files in `tabs/`, so contributors can still add or edit one `.txt`
file and have it appear in the web UI automatically after the next build.

## Development

Requirements:

- Node.js 20 or newer

Commands:

```sh
npm run build
npm run dev
```

`npm run build` scans `tabs/*.txt`, copies the raw tabs, generates `tabs.json`,
and writes the static site to `dist/`.

The main page provides an instant search across all songs (Title | Search bar | List).
Clicking any song opens a dedicated HTML tab page that renders directly in any
mobile or desktop browser without triggering file save/download prompts. The tab
viewer includes clean monospace formatting, horizontal scrolling, pinch-to-zoom
support, a back link to the song list, and links to both view and download the raw `.txt` file.

## Hosting

This project is ready for GitHub Pages. The included GitHub Actions workflow
builds `dist/` and deploys it whenever changes land on `main` or `master`.

To enable it in GitHub:

1. Open the repository settings.
2. Go to Pages.
3. Choose GitHub Actions as the Pages source.
4. Add a custom domain there if you want `umtabs.com` to keep working.

## Editing transcriptions

Feel free to suggest edits to any of the files in the project.  To do so: 

1. Browse to the file you want to edit and click the "Edit" button near the top of the file.  
2. Make your changes, then click "Propose File Change." 
3. On the next page, click "Send pull request" to send a request to have your changes merged back into the main project. If you've changed your mind and want to delete your changes, click on the "Branches" tab and delete the branch.
4. Once your request has been accepted, you can delete the branch that was created for you automatically.

## Submitting a new transcription

1. Click [Submit a new guitar transcription](https://github.com/mattypiper/umtabs/new/master/tabs).
2. Paste or type in the transcription, then click "Propose new file"
3. On the next page, click "Send pull request" to send a request to have your transcription file merged into the main project.

## Requests

1. [Create an issue](https://github.com/mattypiper/umtabs/issues/new) and in the description include the name of the song you'd like to see transcribed.

## Collaborators

If you are interested in helping on an ongoing basis to review pull requests (changes) and curate the project, please [get in touch with mattypiper](https://github.com/mattypiper).
