::Basic topics

- What is it?
An Evolus Pencil template for exporting HTML documents.

- How does it look like?
Check the "screenshot" folder to have an idea.

- In which output format (exporting format) is it available?
Single web page

- What is the name of the template in the selection list?
HMagalhaes's Prototype (LANGUAGE)
where LANGUAGE will be the installed language, for instance, "eng" or "pt".

- Can more than one language be installed at the same time?
Yes. Each language is registered as a different template.

Tip: If you build your own new language, spend some time editing the "Template.xml"
file in order to give your version a new name and avoid conflicts.

- What is a Pencil template package?
A simple Zip file containg some specific files organized in a determined structure.
Tip: Only some files are determined, must of them are up to the template writer.


::How to build

In order to install it on Pencil, you need to build the Zip package following the
correct structure.

More easily, you can use the provided "buil.sh" Shell Script to build it. Other 
way is to simple organize the files in the specific structure and compress it
into a commom Zip file.

The files structure and the "build.sh" are described in the topics bellow.


::The files structure

The source structure: It is organized in a way to keep functionality, at least, a
little decoupled from language content. Follows:
	
	|_ core => Core files, used in any language.
		|_ StyleSheet.xslt => Defines the resultant HTML file structure.
		|_ Resources/ => Resource files used in any language
			|_ js
			|_ style
	|_ lang => Language dependent files
		|_ LANGTAG => Files related to the specified language
			|_ Template.xml => Template descriptor
			|_ Resources/ => Resource files used only in the specified language
				|_ js
				|_ style

The build structure is a mix from the core files with the chosen language content:

		|_ StyleSheet.xslt
		|_ Template.xml
		|_ Resources/
			|_ js
			|_ style


::Manually building it

Just mix the content from the "core" with the chosen language folder.


::Using the "build.sh"

You just need to tell it which language you want to build. For instance, to build
brazilian portuguese, use:
	$ ./build.sh pt

It's a simple script, the language parameter is the language directory name within the
"lang" dir.

Dependencies:
If you encounter any problem, try to install the following utilities (available in debian like repositories):
zip, cpio and findutils.


:: How to install and use in Pencil?

Go to Pencil and hit the following steps:
1) Menu "Document > Export document";
2) Pick "Single web page";
3) Pick anything;
4) Hit the "Manage templates" link;
5) Click on "Install template" and select the zip package;
6) Go back to the template selection list and have fun.