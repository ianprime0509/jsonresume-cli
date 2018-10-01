# JSON Resume CLI

This is a CLI tool for creating and formatting JSON Resumes. It is unrelated
to [the official JSON Resume CLI](https://github.com/jsonresume/resume-cli),
but processes resumes in the same format (or, rather, a superset thereof).
Currently, integration with resume publishing platforms is not a goal of this
project.

## Theme modules

In order to export a resume into another format, such as HTML, it is
necessary to use a _theme module_. The theme module format understood by this
project is compatible with that used by the official JSON Resume CLI;
currently, it is identical, but backwards-compatible extensions may be made
later to support more advanced features.

A theme module must contain an exported function called `render`, which takes
as its first parameter the resume data to render and returns a `string` with
the rendered content. In other words, it must look like the following:

```ts
export function render(resume: JSONResume): string {
  // Implementation goes here.
  return renderedResume;
}
```

Theme module names should begin with the prefix `jsonresume-theme-`; this
prefix will be automatically added to theme names specified with the
`-t, --theme` option if not present.

By default, the CLI will use
[jsonresume-theme-even](https://github.com/rbardini/jsonresume-theme-even) if
no theme is specified. Clients may install additional themes as global modules.
