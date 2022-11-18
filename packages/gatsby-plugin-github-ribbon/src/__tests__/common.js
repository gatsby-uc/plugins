import { buildImgUrl } from "../common";

describe(`gatsby-plugin-github-ribbon`, () => {
  describe(`buildImgUrl`, () => {
    test.each`
      color         | position   | expected
      ${`red`}      | ${`left`}  | ${`https://s3.amazonaws.com/github/ribbons/forkme_left_red_aa0000.png`}
      ${`green`}    | ${`left`}  | ${`https://s3.amazonaws.com/github/ribbons/forkme_left_green_007200.png`}
      ${`darkblue`} | ${`left`}  | ${`https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png`}
      ${`orange`}   | ${`left`}  | ${`https://s3.amazonaws.com/github/ribbons/forkme_left_orange_ff7600.png`}
      ${`gray`}     | ${`left`}  | ${`https://s3.amazonaws.com/github/ribbons/forkme_left_gray_6d6d6d.png`}
      ${`white`}    | ${`left`}  | ${`https://s3.amazonaws.com/github/ribbons/forkme_left_white_ffffff.png`}
      ${`red`}      | ${`right`} | ${`https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png`}
      ${`green`}    | ${`right`} | ${`https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png`}
      ${`darkblue`} | ${`right`} | ${`https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png`}
      ${`orange`}   | ${`right`} | ${`https://s3.amazonaws.com/github/ribbons/forkme_right_orange_ff7600.png`}
      ${`gray`}     | ${`right`} | ${`https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png`}
      ${`white`}    | ${`right`} | ${`https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png`}
    `(`returns valid url to the $color $position image on aws`, ({ color, position, expected }) => {
      expect(buildImgUrl(color, position)).toBe(expected);
    });
  });
});
