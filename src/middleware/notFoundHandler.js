// src/middleware/notFoundHandler.js
//Стало
export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: 'Route not found' });
};

//Було
//app.use((req, res) => {
  //res.status(404).json({ message: 'Route not found' });
//});
