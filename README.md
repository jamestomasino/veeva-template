# Veeva Template

This is a blank template for a Veeva CLM presentation that can utilize Shared
Resources, provide some convenience methods and basic library support. Code is
namespaced and easily extensible.

## Installing / Getting started

Clone, fetch, or download this repo into your new project folder.

```bash
	make install
```

After running `make install` you will be prompted for the name of the project.
Enter a name using lowercase letters and dashes for spaces (e.g.,
"sample-project" or "magic-beans-are-cool"). The project will update paths and
package names to match your input.

## Developing

This template utilizes my Veeva framework and stubs out a sample project
library. The code is namespaced and suggestive of a style, but everything is
extremely flexible. Individual Slides can use their own build tools, structure,
and media type without conflict.

### Building

To build the project:

```bash
	make build
```

The default task is `build`, so you can just run `make` if you prefer. The
build task will cycle through each Slide in the presentation and attempt to run
a build script or gulp task if appropriate.

### Deploying / Publishing

The first step in deploying Veeva presentations is to generate the slide zip files.

```bash
	make zip
```

This will create a zip file for each slide in the presentation and store them
in the `zip` folder at the root of the project. If `SHARED_RESOURCES_SUPPORT`
is true in the Makefile, this will also generate a zip for the project shared
resource. Otherwise the contents of the project shared resource will be
included in place in each zip.

## Features

Primarily this template is about the organization of Slides and shared
resources and simple automation of build tasks. Some sample code is present as
a template suggestion, as is the use of my Veeva framework.

## Configuration

There are some options available for configuration with this template.

#### Shared Resources

If your Veeva installation supports Shared Resources, set this property to
`true` to enable the appropriate zip structure. Setting this to `false` will
embed the contents of the `shared` folder into each Slide instead.

Locate the following line in `Makefile` to adjust:
```bash
	SHARED_RESOURCES_SUPPORT=true
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature
branch. Pull requests are warmly welcomed.

## Licensing

The code in this project is licensed under MIT license with the exception of
bundled 3rd party libraries such as (but not limited to):

- Greensock Animation Platform
- jQuery TouchSwipe
