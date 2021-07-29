export default function handler(req, res) {
  console.log("We're in our function!!");

  if (typeof res.statusCode === "function") {
    res.statusCode(200).json({ hello: `world` });
  } else {
    res.code(200).send({ hello: `world` });
  }
}
