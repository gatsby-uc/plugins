export default function handler(req, res) {
  res.code(200).send(req.params);
}
