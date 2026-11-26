// Formularios propios (sustituyen a forms.app). Las mismas preguntas que tenían en forms.app.
// La definición se usa en tres sitios: para pintar el formulario, para validar en el servidor y para la página de admin.

export type FieldType = 'text' | 'email' | 'number' | 'textarea' | 'radio' | 'checkbox';
export type Lang = 'es' | 'en';
type L = { es: string; en: string };

export interface Field {
  name: string;
  type: FieldType;
  label: L;
  placeholder?: L;
  required?: boolean;
  max?: number;              // largo máximo del texto
  options?: { value: string; label: L }[];
  half?: boolean;            // ocupa media fila en escritorio
}

export interface FormDef {
  id: 'contact' | 'apply';
  title: L;
  intro: L[];
  fields: Field[];
  // además de los "required": al menos uno de estos campos tiene que venir relleno
  oneOf?: { names: string[]; message: L };
  sent: L;
}

const opt = (value: string, es: string, en: string) => ({ value, label: { es, en } });

export const FORMS: Record<'contact' | 'apply', FormDef> = {
  contact: {
    id: 'contact',
    title: { es: 'Contacto', en: 'Contact' },
    intro: [
      { es: 'Si quieres hacer un proyecto con nosotros, sé lo más específico posible para que podamos organizarlo.', en: 'If you want to work on a project with us, be as specific as possible so we can plan it.' },
      { es: 'Si hace falta una respuesta o nos interesa el proyecto, te contactaremos por Discord, X o correo. También puedes escribirnos a contact@b4nned.xyz.', en: 'If a reply is needed or we are interested in the project, we will contact you on Discord, X or by email. You can also write to contact@b4nned.xyz.' },
    ],
    fields: [
      { name: 'name', type: 'text', label: { es: 'Nombre completo', en: 'Full name' }, required: true, max: 120, half: true },
      { name: 'email', type: 'email', label: { es: 'Correo electrónico', en: 'Email' }, placeholder: { es: 'tu@correo.com', en: 'you@email.com' }, max: 160, half: true },
      { name: 'discord', type: 'text', label: { es: 'Discord (nombre de usuario)', en: 'Discord (username)' }, max: 60, half: true },
      { name: 'twitter', type: 'text', label: { es: 'Twitter / X (@)', en: 'Twitter / X (@)' }, placeholder: { es: '@usuario', en: '@user' }, max: 60, half: true },
      { name: 'message', type: 'textarea', label: { es: 'Mensaje', en: 'Message' }, required: true, max: 5000 },
    ],
    oneOf: { names: ['email', 'discord', 'twitter'], message: { es: 'Deja al menos un correo, Discord o X para poder responderte.', en: 'Leave at least an email, Discord or X so we can reply.' } },
    sent: { es: 'Mensaje enviado. Si hace falta, te responderemos por Discord, X o correo.', en: 'Message sent. If needed, we will reply on Discord, X or by email.' },
  },

  apply: {
    id: 'apply',
    title: { es: 'Postúlate', en: 'Apply' },
    intro: [
      { es: 'Responde con total sinceridad. Las preguntas son solo para conocerte un poco más y no estás obligado a responderlas todas.', en: 'Please answer honestly. The questions are only to get to know you a bit better and you don’t have to answer all of them.' },
      { es: 'Todo el trabajo es voluntario, sin pago (salvo excepciones), así que no se exigirá mucho. Si encajas con lo que buscamos, te contactaremos por Discord o X.', en: 'All work is voluntary and unpaid (with some exceptions), so not much will be demanded. If you fit what we are looking for, we will contact you on Discord or X.' },
    ],
    fields: [
      { name: 'discord', type: 'text', label: { es: 'Discord (nombre de usuario)', en: 'Discord (username)' }, required: true, max: 60, half: true },
      { name: 'twitter', type: 'text', label: { es: 'Twitter / X (@)', en: 'Twitter / X (@)' }, placeholder: { es: '@usuario', en: '@user' }, max: 60, half: true },
      { name: 'name', type: 'text', label: { es: 'Nombre y/o apodo', en: 'Name and/or nickname' }, required: true, max: 120, half: true },
      { name: 'age', type: 'number', label: { es: 'Edad', en: 'Age' }, max: 3, half: true },
      { name: 'country', type: 'text', label: { es: 'Nacionalidad', en: 'Nationality' }, max: 80, half: true },
      { name: 'languages', type: 'text', label: { es: 'Idiomas que hablas', en: 'Languages you speak' }, max: 200, half: true },
      { name: 'situation', type: 'radio', label: { es: 'Situación actual', en: 'Current situation' }, options: [
        opt('student', 'Estudiante', 'Student'), opt('worker', 'Trabajador', 'Working'), opt('unemployed', 'Desempleado', 'Unemployed'),
      ] },
      { name: 'areas', type: 'checkbox', label: { es: 'Áreas en las que te especializas', en: 'Areas you specialise in' }, required: true, options: [
        opt('design2d', 'Diseño 2D', '2D design'), opt('design3d', 'Diseño 3D', '3D design'), opt('programming', 'Programación', 'Programming'),
        opt('config', 'Configuración (plugins, mods, datapacks, texturas…)', 'Configuration (plugins, mods, datapacks, textures…)'),
        opt('building', 'Construcción', 'Building'), opt('animation', 'Animación', 'Animation'), opt('music', 'Composición musical', 'Music composition'),
        opt('voice', 'Doblaje', 'Voice acting'), opt('moderation', 'Moderación', 'Moderation'), opt('other', 'Otro', 'Other'),
      ] },
      { name: 'software', type: 'text', label: { es: 'Programas que utilizas según tu área', en: 'Software you use for your area' }, max: 300 },
      { name: 'portfolio', type: 'text', label: { es: 'Ejemplos de tu trabajo (un enlace si puedes)', en: 'Examples of your work (a link if you can)' }, max: 500 },
      { name: 'availability', type: 'text', label: { es: 'Disponibilidad horaria', en: 'Availability' }, max: 200 },
      { name: 'about', type: 'textarea', label: { es: 'Háblanos sobre ti', en: 'Tell us about yourself' }, max: 3000 },
      { name: 'condition', type: 'checkbox', label: { es: 'Trastorno o condición que debamos conocer (opcional)', en: 'Any disorder or condition we should know about (optional)' }, options: [
        opt('autism', 'Autismo', 'Autism'), opt('adhd', 'TDAH', 'ADHD'), opt('dyslexia', 'Dislexia', 'Dyslexia'), opt('colorblind', 'Daltonismo', 'Colour blindness'),
        opt('none', 'Ninguno', 'None'), opt('other', 'Otro', 'Other'), opt('private', 'Prefiero no decirlo', 'Prefer not to say'),
      ] },
    ],
    sent: { es: '¡Postulación enviada! Si encajas con lo que buscamos, te contactaremos por Discord o X.', en: 'Application sent! If you fit what we are looking for, we will contact you on Discord or X.' },
  },
};

// Valida y limpia lo que llega del navegador. Devuelve los datos limpios o un mensaje de error.
export function validate(form: FormDef, raw: Record<string, unknown>, lang: Lang): { data?: Record<string, string | string[]>; error?: string } {
  const data: Record<string, string | string[]> = {};
  for (const f of form.fields) {
    const v = raw[f.name];
    if (f.type === 'checkbox') {
      const allowed = new Set(f.options!.map((o) => o.value));
      const list = (Array.isArray(v) ? v : []).filter((x): x is string => typeof x === 'string' && allowed.has(x));
      if (f.required && !list.length) return { error: `${f.label[lang]}: ${lang === 'es' ? 'elige al menos una opción' : 'pick at least one option'}` };
      if (list.length) data[f.name] = [...new Set(list)];
      continue;
    }
    const s = typeof v === 'string' || typeof v === 'number' ? String(v).trim() : '';
    if (f.required && !s) return { error: `${f.label[lang]}: ${lang === 'es' ? 'campo obligatorio' : 'required field'}` };
    if (!s) continue;
    if (s.length > (f.max ?? 500)) return { error: `${f.label[lang]}: ${lang === 'es' ? 'demasiado largo' : 'too long'}` };
    if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return { error: lang === 'es' ? 'El correo no es válido' : 'Invalid email' };
    if (f.type === 'number' && !/^\d{1,3}$/.test(s)) return { error: `${f.label[lang]}: ${lang === 'es' ? 'número no válido' : 'invalid number'}` };
    if (f.type === 'radio' && !f.options!.some((o) => o.value === s)) continue;
    data[f.name] = s;
  }
  if (form.oneOf && !form.oneOf.names.some((n) => data[n])) return { error: form.oneOf.message[lang] };
  return { data };
}
