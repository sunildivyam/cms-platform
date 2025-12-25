If you are trying to test your functions before you deploy, here is the link to the documentation on how to do so: run functions locally. Specifically, this part is of interest:

If you're using custom functions configuration variables, run the following command in the functions directory of your project before running firebase serve.

firebase functions:config:get > .runtimeconfig.json
