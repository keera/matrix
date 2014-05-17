### Matrix

This is a blogging engine that I wrote for personal use. I designed the application with a few things in mind:

##### Simple, no-frills dashboard

I don't like static site generators because the interface is the command line. I've also used Wordpress but found it to be too complex and too slow. The Matrix admin dashboard is simple as hell. Upon logging in, you see your list of files. If you're looking for a particular set of files, you can either filter the list or search for a specific file. Common operations like creating a new file or updating an existing file are also straightforward and fast.

##### Powerful editor

I really like the Stackoverflow editor and I'm not ashamed to say that I set out to copy it. I don't like writing markdown, so using something like vim is a pain in the ass. With the Matrix editor, I can set custom key bindings that format my content with markdown. What's more, I can even preview the html right beside my editor so I know how it'll appear on my blog.

##### Relational

When I think about ideas, I think about them in context of other ideas. I see relationships. Therefore, as I'm writing, I'm constantly making connections between ideas. Since writing is an extension of my thought, my writing tool should allow me to concretely associate a piece of content in a file with another file (connection) as well as group related files under topics (abstraction). Matrix allows me to do both easily using fast-(hyper)linking (creates a hyperlink to an existing file with a short key combo) and file labeling (tagging).

##### Stack

* Yeoman
* Require
* Backbone
* Node
