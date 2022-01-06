import React, { useState, useEffect } from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import { Button } from '@components/Button';
import { ButtonBack } from '@components/ButtonBack';
import { RadioButton } from '@components/RadioButton';
import { Input } from '@components/Input';
import { ProductProps } from '@components/ProductCard';

import { useAuth } from '@hooks/auth';

import { OrderNavigationProps } from '@src/@types/navigation';

import { PIZZA_TYPES } from '@utils/pizzaTypes';

import {
  Container,
  ContentScroll,
  Form,
  FormRow,
  Header,
  InputGroup,
  Label,
  Photo,
  Price,
  Sizes,
  Title,
} from './styles';

type PizzaResponse = ProductProps & {
  price_sizes: {
    [key: string]: number;
  };
};

export function Order() {
  const [size, setSize] = useState('');
  const [pizza, setPizza] = useState<PizzaResponse>({} as PizzaResponse);
  const [quantity, setQuantity] = useState(0);
  const [tableNumber, setTableNumber] = useState('');
  const [sendingOrder, setSendingOrder] = useState(false);

  const { goBack, navigate } = useNavigation();
  const { params } = useRoute();
  const { user } = useAuth();
  const { id } = params as OrderNavigationProps;

  const amount = size ? pizza.price_sizes[size] * quantity : '0,00';

  useEffect(() => {
    if (id) {
      firestore()
        .collection('pizzas')
        .doc(id)
        .get()
        .then((response) => setPizza(response?.data() as PizzaResponse))
        .catch((error) =>
          Alert.alert('Pedido', 'Não foi possível carregar o produto.')
        );
    }
  }, [id]);

  function handleOrder() {
    if (!size) {
      return Alert.alert('Pedido', 'Selecione o tamanho da pizza.');
    }

    if (!tableNumber) {
      return Alert.alert('Pedido', 'Informe o número da mesa.');
    }

    if (!quantity) {
      return Alert.alert('Pedido', 'Informe a quantidade.');
    }

    setSendingOrder(true);

    firestore()
      .collection('orders')
      .add({
        quantity,
        amount,
        pizza: pizza?.name,
        size,
        table_number: tableNumber,
        status: 'Preparando',
        waiter_id: user?.id,
        image: pizza?.photo_url,
      })
      .then(() => navigate('home'))
      .catch(() => {
        Alert.alert('Pedido', 'Não foi possível realizar o pedido.');
        setSendingOrder(false);
      });
  }

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ContentScroll>
        <Header>
          <ButtonBack onPress={goBack} style={{ marginBottom: 108 }} />
        </Header>

        <Photo source={{ uri: pizza?.photo_url }} />

        <Form>
          <Title>{pizza?.name}</Title>
          <Label>Selecione o tamanho da pizza</Label>
          <Sizes>
            {PIZZA_TYPES.map((item) => (
              <RadioButton
                key={item?.id}
                title={item?.name}
                onPress={() => setSize(item?.id)}
                selected={size === item?.id}
              />
            ))}
          </Sizes>

          <FormRow>
            <InputGroup>
              <Label>Número da mesa</Label>
              <Input keyboardType="numeric" onChangeText={setTableNumber} />
            </InputGroup>

            <InputGroup>
              <Label>Quantidade</Label>
              <Input
                keyboardType="numeric"
                onChangeText={(value) => setQuantity(Number(value))}
              />
            </InputGroup>
          </FormRow>

          <Price>Valor de R$ {amount}</Price>

          <Button
            title="Confirmar Pedido"
            onPress={handleOrder}
            isLoading={sendingOrder}
          />
        </Form>
      </ContentScroll>
    </Container>
  );
}
