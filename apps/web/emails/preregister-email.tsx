import {
  Body,
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
const codeContainer = {
  background: "rgba(0,0,0,.05)",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};
export default function PreregisterEmail({ email = "" }: { email: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded border border-solid border-gray-200 px-10 py-5">
            <Section className="mt-8">
              <Img
                src="https://res.cloudinary.com/dx65nxpkq/image/upload/t_media_lib_thumb/v1692740777/logo_edukeasy_ukptzb.jpg"
                width="152"
                height="48"
                alt="Elearnco"
                className="mx-auto my-0"
              />
            </Section>
            <Heading className="mx-0 my-7 p-0 text-center text-xl font-semibold !text-black">
              Welcome !
            </Heading>
            <Section className="my-8">
              <Img
                src="http://res.cloudinary.com/dx65nxpkq/image/upload/t_media_lib_thumb/v1692772540/avatar_1_c9w31h.jpg"
                alt="Elearnco"
                width="70"
                height="70"
                className="mx-auto my-0"
              />
            </Section>
            <Text className="text-sm leading-6 text-black">
              Thanks for your registration !
            </Text>
            <Text className="text-sm leading-6 text-black">
              Elearnco is an open source educational platform
              that allows you to create engaging educational paths and give your
              learners a hand in creating their content. We are excited to have you
              on board!
            </Text>
            <Text className="text-sm leading-6 text-black">
              Here are a few things you can do:
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Create a engaging educational paths
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Create a a journey shared with your learners in collaborative
              mode
            </Text>
            <Text className="ml-1 text-sm leading-4 text-black">
              ◆ Share your content with your colleagues or learners
            </Text>

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
