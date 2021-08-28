
client.on('error', function (error) {
  console.error(error)
})

client.set('key', 'value', redis.print)
client.get('key', redis.print)
