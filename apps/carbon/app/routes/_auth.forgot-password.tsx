import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Image,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { json, redirect } from "@remix-run/node";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";

import { Input, Submit } from "~/components/Form";
import { getAuthSession } from "~/services/session";
import { forgotPasswordValidator, sendMagicLink } from "~/services/auth";
import { getUserByEmail } from "~/services/users";
import { assertIsPost } from "~/utils/http";
import type { FormActionData, Result } from "~/types";

export const meta: MetaFunction = () => ({
  title: "Carbon | Forgot Password",
});

export async function loader({ request }: LoaderArgs) {
  const authSession = await getAuthSession(request);
  if (authSession) return redirect("/app");
  return null;
}

export async function action({ request }: ActionArgs): FormActionData {
  assertIsPost(request);
  const validation = await forgotPasswordValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { email } = validation.data;

  if ((await getUserByEmail(email))?.data) {
    const authSession = await sendMagicLink(email);

    if (!authSession) {
      return json(
        { success: false, message: "Failed to send email" },
        { status: 500 }
      );
    }
  }

  return json({ success: true });
}

export default function ForgotPasswordRoute() {
  const actionData = useActionData<Result>();
  const boxBackground = useColorModeValue("white", "gray.700");

  return (
    <Box
      minW="100vw"
      minH="100vh"
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <VStack spacing={8} mx="auto" maxW="lg" pt={24} px={6}>
        <Image
          src={useColorModeValue("/logo-dark.png", "/logo-light.png")}
          alt="Carbon Logo"
          maxW={100}
          marginBottom={3}
        />
        {actionData?.success ? (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="240px"
            p={8}
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Success
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              If you have an account, you should receive an email shortly with a
              link to log in.
            </AlertDescription>
          </Alert>
        ) : (
          <Box rounded="lg" bg={boxBackground} boxShadow="lg" w={380} p={8}>
            <ValidatedForm validator={forgotPasswordValidator} method="post">
              <VStack spacing={4} alignItems="start">
                <Text>
                  Please enter your email address to search for your account.
                </Text>
                {actionData?.success === false && (
                  <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>{actionData?.message}</AlertTitle>
                  </Alert>
                )}
                <Input name="email" label="Email" />
                <Submit w="full">Search</Submit>
              </VStack>
            </ValidatedForm>
          </Box>
        )}
      </VStack>
    </Box>
  );
}