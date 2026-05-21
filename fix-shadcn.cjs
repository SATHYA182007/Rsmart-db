const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/components/ui/sidebar.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/tooltip.tsx',
  'src/components/ui/skeleton.tsx'
];

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Tailwind v4 specific classes with v3 equivalents
  content = content
    .replace(/size-full/g, 'w-full h-full')
    .replace(/size-4/g, 'w-4 h-4')
    .replace(/size-5/g, 'w-5 h-5')
    .replace(/size-8/g, 'w-8 h-8')
    .replace(/size-2\.5/g, 'w-2.5 h-2.5')
    .replace(/w-\(--sidebar-width\)/g, 'w-[var(--sidebar-width)]')
    .replace(/w-\(--sidebar-width-icon\)/g, 'w-[var(--sidebar-width-icon)]')
    .replace(/\(--spacing\(4\)\)/g, '1rem')
    .replace(/outline-hidden/g, 'outline-none')
    .replace(/data-open:/g, 'data-[state=open]:')
    .replace(/data-closed:/g, 'data-[state=closed]:')
    .replace(/data-active:/g, 'data-[active=true]:')
    .replace(/in-data-\[side=left\]:/g, 'group-data-[side=left]:')
    .replace(/in-data-\[side=right\]:/g, 'group-data-[side=right]:')
    .replace(/\[--radius:var\(--radius-xl\)\]/g, '')
    .replace(/\*\*:data-\[slot=kbd\]:/g, '[&_kbd]:')
    .replace(/--radix-tooltip-content-transform-origin/g, 'radix-tooltip-content-transform-origin')
    .replace(/p-0!/g, '!p-0')
    .replace(/size-8!/g, '!w-8 !h-8');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${file}`);
});
