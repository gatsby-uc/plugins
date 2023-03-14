import { isGatsbyHosting } from "../../utils/functions";

export default function handler(req, res) {
  if (isGatsbyHosting(res)) {
    res.status(200).send(req.params);
  } else {
    res.code(200).send(req.params);
  }
}
