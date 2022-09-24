import fs from 'fs';
import yaml from "js-yaml";

try {
  const doc = yaml.load(fs.readFileSync('paastis.yml', 'utf8'));
  console.log(doc);
  const groups = doc.groups;

  function getAppGroup(appName) {
    for (let i = 0 ; i < groups.length ; i++) {
      const { pattern, name } = groups[i];
      const regex = new RegExp(pattern);
      const found = appName.match(regex, );
      if (found && found.index === 0) {
        let groupName = name;
        for (let j = 1 ; j < found.length ; j++) {
          groupName = groupName.replace(`$${j}`, found[j]);
        }
        return groupName;
      }
    }
  }

  /*
    const appWithGroup_0 = getAppGroup('titi-toto');
    console.log(appWithGroup_0);
  */

  const appWithGroup_1 = getAppGroup('cdb-app-review-pr123-back');
  console.log(appWithGroup_1);

  const appWithGroup_2 = getAppGroup('pix-app-review-pr123-front');
  console.log(appWithGroup_2);

  /*
    const appWithGroup_3 = getAppGroup('cdb-review-app-pr123-front');
    console.log(appWithGroup_3);
  */


} catch (e) {
  console.log(e);
}
