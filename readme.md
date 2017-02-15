**Starting the API:**

Inside the API root directory, run the following command:

`NODE_ENV=staging forever --max_old_space_size=20480 start ./bin/www`

**Stopping the API:**

Run the following command:

`forever stop 0`

**Get the current log:**

Find the log file with the following command:

`forever list`

This will return the list of applications running with forever where you will get the log file name.