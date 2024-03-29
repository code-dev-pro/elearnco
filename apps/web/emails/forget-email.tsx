import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
const buttonContainer = {
  padding: "0px 0 27px",
  textAlign: "center" as const,
};
const button = {
  backgroundColor: "#000",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "170px",
};

export default function ForgetEmail({
  email = "",
  url = "",
}: {
  email: string;
  url: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>Reset Password</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src="https://res.cloudinary.com/dx65nxpkq/image/upload/v1700661141/logo_elearnco_t355te.jpg"
                width="152"
                height="48"
                alt="Elearnco"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold !text-black">
              Reset password
            </Heading>
            <Section className="my-8">
              <Img
                src="http://res.cloudinary.com/dx65nxpkq/image/upload/t_media_lib_thumb/v1692772540/avatar_1_c9w31h.jpg"
                alt="Laurent"
                width="70"
                height="70"
                className="mx-auto my-0"
              />
            </Section>
            <Text className="text-sm leading-6 text-black">
              You can reset your password by clicking here :
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href={url} target="_blank">
                Reset my password
              </Button>
            </Section>

            <Text className="text-sm leading-6 text-black">
              Let me know if you have any questions or feedback. I'm always
              happy to help!
            </Text>
            <Hr style={hr} />
            <Text className="text-sm font-light leading-6 text-gray-400">
              Team from Elearnco
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
