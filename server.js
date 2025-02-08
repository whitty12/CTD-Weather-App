const express = require('express')
const app = express()
const PORT = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})