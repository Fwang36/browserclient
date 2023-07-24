const SentryNode = require("@sentry/node")
const SentryBrowser = require("@sentry/browser")

const body = {
    action: '',
    envId: 'abc',
    err: {
    message: '\"[object Object]\" is not valid JSON',
    stack: `SyntaxError: \"[object Object]\" is not valid JSON\n at JSON.parse (<anonymous>)\n at Function.importLaunchDarklyData (https://cdn.staging.###.com/##.js:704:28382)\n at <anonymous>:1:7`,
    },
}

const sdkError = new Error(body.action);
sdkError.name = body.action
sdkError.stack = body.err.stack;



const client = new SentryNode.NodeClient({
    dsn: 'https://ae97365bbd3b477782775a27abaef87a@o1407376.ingest.sentry.io/4505581854588928',
    environment: process.env.NODE_ENV || 'development',
    integrations: SentryNode.defaultIntegrations,
    stackParser: SentryNode.defaultStackParser,
    transport: SentryNode.makeNodeTransport,
    beforeSend: function (event) {

    console.log(event.exception.values[0].stacktrace)

    
    event.release = 'test-shim'
    return event;
    }
    })


const client2 = new SentryBrowser.BrowserClient({
    dsn: "https://ae97365bbd3b477782775a27abaef87a@o1407376.ingest.sentry.io/4505581854588928",
    transport: SentryBrowser.makeFetchTransport,
    stackParser: SentryBrowser.defaultStackParser,
    integrations: [SentryBrowser.defaultIntegrations],
      
    beforeSend(event) {
      
        event.release = "test-shim"
      
        // console.log(event)
      
        return event
    }
})    

// console.log(client.captureException(sdkError)) //Try sending error with NodeClient

console.log(client2.captureException(sdkError))  //Try sending error with BrowserClient
