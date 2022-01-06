import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { useAuth } from '@hooks/auth';

import brandIMG from '@assets/brand.png';

import {
  Brand,
  Container,
  Content,
  Title,
  ForgotPasswordButton,
  ForgotPasswordLabel,
} from './styles';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, isLogging, forgotPassword } = useAuth();

  function handleSignIn() {
    signIn(email, password);
  }

  function handleForgotPassword() {
    forgotPassword(email);
  }

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Content>
          <Brand source={brandIMG} />

          <Title>Login</Title>
          <Input
            placeholder="E-mail"
            type="secondary"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <Input
            placeholder="Senha"
            type="secondary"
            autoCorrect={false}
            secureTextEntry
            onChangeText={setPassword}
          />

          <ForgotPasswordButton onPress={handleForgotPassword}>
            <ForgotPasswordLabel>Esqueci minha senha</ForgotPasswordLabel>
          </ForgotPasswordButton>

          <Button
            title="Entrar"
            type="secondary"
            onPress={handleSignIn}
            isLoading={isLogging}
          />
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}
