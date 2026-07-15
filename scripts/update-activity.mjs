/**
 * Niumination Profile — Activity Updater
 *
 * Fetches recent public GitHub activity and updates the README
 * between ACTIVITY_START and ACTIVITY_END markers.
 *
 * Usage: node scripts/update-activity.mjs [--dry-run]
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const README_PATH = join(root, 'README.md');
const CONFIG_PATH = join(root, 'profile.config.json');

const dryRun = process.argv.includes('--dry-run');

// Load config
let config;
try {
  config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
} catch {
  console.error('❌ Cannot read profile.config.json');
  process.exit(1);
}

if (!config.activity?.enabled) {
  console.log('⏸️  Activity updates disabled in config');
  process.exit(0);
}

const limit = config.activity.limit || 6;
const username = config.profile.username || 'Niumination';

async function fetchRecentActivity() {
  try {
    // Use GitHub Events API (no token needed for public events)
    const url = `https://api.github.com/users/${username}/events/public?per_page=${limit}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`GitHub API returned ${res.status}`);
    }

    const events = await res.json();
    
    if (!Array.isArray(events) || events.length === 0) {
      return '*No recent public activity.*';
    }

    const lines = events.map(event => {
      const date = new Date(event.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
      });
      
      switch (event.type) {
        case 'PushEvent': {
          const repo = event.repo.name;
          const commits = event.payload.commits || [];
          const count = commits.length;
          const msg = commits[0]?.message?.split('\n')[0] || '';
          return `- [${date}] Pushed ${count} commit${count > 1 ? 's' : ''} to [${repo}](https://github.com/${repo}) — ${msg}`;
        }
        case 'CreateEvent': {
          const repo = event.repo.name;
          const ref = event.payload.ref || 'repository';
          return `- [${date}] Created ${event.payload.ref_type} \`${ref}\` in [${repo}](https://github.com/${repo})`;
        }
        case 'IssuesEvent': {
          const repo = event.repo.name;
          const action = event.payload.action;
          const title = event.payload.issue?.title || '';
          return `- [${date}] ${action} issue [#${event.payload.issue?.number}](${event.payload.issue?.html_url}) in [${repo}](https://github.com/${repo}) — ${title}`;
        }
        case 'IssueCommentEvent': {
          const repo = event.repo.name;
          return `- [${date}] Commented on issue [#${event.payload.issue?.number}](${event.payload.issue?.html_url}) in [${repo}](https://github.com/${repo})`;
        }
        case 'PullRequestEvent': {
          const repo = event.repo.name;
          const action = event.payload.action;
          const prTitle = event.payload.pull_request?.title || '';
          return `- [${date}] ${action} PR [#${event.payload.pull_request?.number}](${event.payload.pull_request?.html_url}) in [${repo}](https://github.com/${repo}) — ${prTitle}`;
        }
        case 'WatchEvent': {
          return `- [${date}] Starred [${event.repo.name}](https://github.com/${event.repo.name})`;
        }
        case 'ForkEvent': {
          return `- [${date}] Forked [${event.repo.name}](https://github.com/${event.repo.name})`;
        }
        default:
          return `- [${date}] Activity in [${event.repo.name}](https://github.com/${event.repo.name})`;
      }
    });

    return lines.join('\n');
  } catch (err) {
    console.error(`⚠️  Failed to fetch activity: ${err.message}`);
    return '*Unable to load recent activity.*';
  }
}

async function main() {
  const activity = await fetchRecentActivity();
  
  let readme;
  try {
    readme = readFileSync(README_PATH, 'utf-8');
  } catch {
    console.error('❌ Cannot read README.md');
    process.exit(1);
  }

  const startMarker = '<!-- ACTIVITY_START -->';
  const endMarker = '<!-- ACTIVITY_END -->';

  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('❌ README missing ACTIVITY_START/ACTIVITY_END markers');
    process.exit(1);
  }

  const before = readme.slice(0, startIdx + startMarker.length);
  const after = readme.slice(endIdx);

  const activityBlock = `\n${activity}\n`;

  const newReadme = before + activityBlock + after;

  if (dryRun) {
    console.log('--- DRY RUN ---');
    console.log('Activity block would be:');
    console.log(activityBlock);
    console.log('--- END DRY RUN ---');
    process.exit(0);
  }

  writeFileSync(README_PATH, newReadme, 'utf-8');
  console.log(`✅ README updated with ${activity.split('\n').filter(l => l.startsWith('- [')).length} recent events`);
}

main().catch(err => {
  console.error(`❌ Error: ${err.message}`);
  process.exit(1);
});
