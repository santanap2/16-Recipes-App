import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import storageDefault from './mocks/storageDefault';
import renderPath from './helpers/renderPath';
import meals from '../../cypress/mocks/meals';
import drinks from '../../cypress/mocks/drinks';
import drinkCategories from '../../cypress/mocks/drinkCategories';
import mealCategories from '../../cypress/mocks/mealCategories';
import mockFetch from './mocks/mockFetch';
import vegetarianMeals from './mocks/vegetarianMeals';
import cocktailDrinks from '../../cypress/mocks/cocktailDrinks';

// Mockar múltiplas requisições à API
// source: https://stackoverflow.com/questions/65837171/vuejs-jest-mocking-multiple-fetch-responses

const flushPromises = () => new Promise((r) => { setTimeout(r); });

describe('Testar se as categorias/comidas são exibidas', () => {
  beforeEach(() => {
    const mockMultFetch = jest.fn()
      .mockReturnValueOnce(mockFetch(mealCategories))
      .mockReturnValue(mockFetch(meals));
    localStorage.setItem('user', storageDefault.user);
    global.fetch = mockMultFetch;
  });
  afterEach(() => localStorage.clear());

  test('Teste se categorias e receitas são buscadas na API e exibidas', async () => {
    await flushPromises();
    renderPath('/meals');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const categoryButtons = screen.queryAllByTestId(/category-filter/i);
    expect(categoryButtons).toHaveLength(6);
    const categoryButton = screen.getByRole('button', { name: /vegetarian/i });
    expect(categoryButton).toBeInTheDocument();
    const mealCards = screen.queryAllByTestId(/recipe-card/i);
    expect(mealCards).toHaveLength(12);
    global.fetch.mockClear();
  });

  test('Teste se receitas de comidas são filtradas ao clicar num botão', async () => {
    await flushPromises();
    renderPath('/meals');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const categoryButtons = screen.queryAllByTestId(/category-filter/i);
    expect(categoryButtons[2]).toHaveTextContent('Vegetarian');
    global.fetch.mockClear();
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(vegetarianMeals));
    userEvent.click(categoryButtons[2]);
    const mealCards = screen.queryAllByTestId(/recipe-card/i);
    expect(mealCards).toHaveLength(12);
  });
});

describe('Testar se as categorias/bebidas são exibidas', () => {
  beforeEach(() => {
    const mockMultFetch = jest.fn()
      .mockReturnValueOnce(mockFetch(drinkCategories))
      .mockReturnValue(mockFetch(drinks));
    localStorage.setItem('user', storageDefault.user);
    global.fetch = mockMultFetch;
  });
  afterEach(() => localStorage.clear());
  test('Teste se categorias e receitas são buscadas na API e exibidas', async () => {
    await flushPromises();
    renderPath('/drinks');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const categoryButtons = screen.queryAllByTestId(/category-filter/i);
    expect(categoryButtons).toHaveLength(6);
    const drinkCards = screen.queryAllByTestId(/recipe-card/i);
    expect(drinkCards).toHaveLength(11);
    global.fetch.mockClear();
  });
  test('Testa se receitas de bebidas são filtradas ao clicar num botão', async () => {
    await flushPromises();
    renderPath('/drinks');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const categoryButtons = screen.queryAllByTestId(/category-filter/i);
    expect(categoryButtons[1]).toHaveTextContent('Cocktail');
    global.fetch.mockClear();
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(cocktailDrinks));
    userEvent.click(categoryButtons[1]);
    const mealCards = screen.queryAllByTestId(/recipe-card/i);
    expect(mealCards).toHaveLength(11);
  });
});
