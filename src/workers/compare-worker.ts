/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

ctx.addEventListener('message', (event) => {
  console.info(event);
  const { data } = event;
  switch (data.cmd) {
    //     case 'connect':
    //         connect(data)
    //         break;
    //     case 'disconnect':
    //         disconnect()
    //         break;
    default:
      ctx.postMessage({
        type: 'error',

        response: `Unknown command: ${data.msg}`,
      });
  }
});

export {};
