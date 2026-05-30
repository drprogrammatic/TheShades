const fs = require('fs');
const path = require('path');

function processDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      processDir(p);
    } else if (p.endsWith('page.js')) {
      let content = fs.readFileSync(p, 'utf8');

      // 1. Remove function AdminSidebar() { ... return (...); }
      content = content.replace(/function AdminSidebar\(\) \{[\s\S]+?return \([\s\S]+?\);\s*\}/, '');

      // 2. Remove <AdminSidebar />
      content = content.replace(/<AdminSidebar \/>/g, '');

      // 3. Remove <div className="admin-layout"> replacing it with nothing
      content = content.replace(/<div className="admin-layout">/g, '');

      // 4. Remove <div className="admin-main"> replacing it with nothing
      content = content.replace(/<div className="admin-main">/g, '');

      // 5. Remove the trailing two closing </div> tags that match the above
      // Using regex to remove two consecutive closing divs before the component ending
      content = content.replace(/<\/div>\s*<\/div>\s*\)\;/g, ');');

      fs.writeFileSync(p, content);
      console.log('Cleaned', p);
    }
  }
}

processDir('src/app/dashboard');
