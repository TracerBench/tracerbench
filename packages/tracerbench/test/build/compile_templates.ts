import { readFileSync } from 'fs';
import { sync as globSync } from 'glob';

export default function compileTemplates(
  precompile: (src: string) => string
): string {
  const templates: string[] = [];
  const TEMPLATE_DIR = 'test/fixtures/templates/';

  globSync(`${TEMPLATE_DIR}/**/*.hbs`).forEach((file) => {
    const src = readFileSync(file, 'utf8');
    const compiled = precompile(src);
    const templateId = file.slice(TEMPLATE_DIR.length, -4);
    console.debug('templateId', templateId);
    templates.push(
      `Ember.TEMPLATES[${JSON.stringify(
        templateId
      )}] = Ember.HTMLBars.template(${compiled});`
    );
  });
  return templates.join('\n');
}
