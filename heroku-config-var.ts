import fs from 'fs';
import childProcess from 'child_process';


/** 
  After deploying the application to Heroku Node.js PaaS, this scripts automatically searches for the .env file at the specified location and save them to a bash file
  which makes heroku config set ready and initialize the app environmental variable.
**/

try {

  let envProps: Buffer = fs.readFileSync(process.cwd() + '\\src\\.env');
  let envPropsContent: string = envProps.toString();
  let herokuConfigVar: string = "#!/bin/bash \n";
  let envPropsArr: string[] = envPropsContent.split('\n').filter((prop: string) => {
    if (prop === '') { return false; }
    else { return true; }
  });

  for (let i = 0; i < envPropsArr.length; i++) {
    let equalTo: number = envPropsArr[i].indexOf('=');
    let propValue: string = envPropsArr[i].substring(equalTo + 1);
    let propName: string = envPropsArr[i].split('=')[0];
    if (equalTo !== -1) herokuConfigVar += `$eval heroku config:set ${propName}=${propValue}\n`;
  }

  let outputfileName: string = process.cwd() + '\\src\\heroku-config-var-file.sh';
  let output: fs.WriteStream = fs.createWriteStream(outputfileName, { 'flags': 'w' });

  output
    .on('open', function (fd: number) { output.write(herokuConfigVar); })
    .on('close', function () { });

  childProcess.exec(`sh ${outputfileName}`, function (err: childProcess.ExecException | null, stdout: string, stderr: string): void {
    if (err) console.log('Error', err);
    if (stderr) console.log('Standard Output error');
    if (stdout) console.log(stdout);
  });
}

catch (err) { console.log(err); }
