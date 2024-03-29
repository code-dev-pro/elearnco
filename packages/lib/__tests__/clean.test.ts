import { describe, expect,it } from "@jest/globals";
import * as DOMPurify from "isomorphic-dompurify";

import { clean } from "../utils";
const sanitizer = DOMPurify.sanitize;

describe("clean function", () => {
  it("should sanitize the input string and remove any script injections", () => {
    const maliciousInput = '<script>alert("malicious code");</script>';
    const cleanedString = clean(maliciousInput);
    const sanitizedString = sanitizer(maliciousInput);
    expect(cleanedString).toEqual(sanitizedString);
  });
});

describe("clean function", () => {
    it("should sanitize the token string and remove any script injections but not change it", () => {
      const token = '7d6ba0b76c74e275999b15fafbf11f1c3af11282';
      const cleanedString = clean(token);
      expect(cleanedString).toEqual(token);
    });
  });
