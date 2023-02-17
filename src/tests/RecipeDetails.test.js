import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderPath from './helpers/renderPath';
import mockFetch from './mocks/mockFetch';
import oneMeal from '../../cypress/mocks/oneMeal';
import oneDrink from '../../cypress/mocks/oneDrink';
import meals from '../../cypress/mocks/meals';
import drinks from '../../cypress/mocks/drinks';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import { favoriteMealRecipes, favoriteDrinkRecipes, doneDrinkRecipes, doneMealRecipes } from './mocks/storageDefault';

// Código para mockar clipboard
// Source: https://stackoverflow.com/questions/62351935/how-to-mock-navigator-clipboard-writetext-in-jest

const testMeal = '/meals/52771';
const testDrink = '/drinks/178319';
const favoriteIconId = 'favorite-icon';
const startRecipeBtnId = 'start-recipe-btn';
const originalClipboard = { ...global.navigator.clipboard };
const mockClipboard = {
  writeText: jest.fn(),
};

const flushPromises = () => new Promise((r) => { setTimeout(r); });

describe('Testar detalhes da comida e botão /start recipe/', () => {
  beforeEach(() => {
    const mockMultFetchClipboard = jest.fn()
      .mockReturnValueOnce(mockFetch(oneMeal))
      .mockReturnValueOnce(mockFetch(drinks))
      .mockReturnValue(mockClipboard);
    global.fetch = mockMultFetchClipboard;
  });
  afterEach(() => {
    global.fetch.mockClear();
    global.navigator.clipboard = originalClipboard;
  });
  test('Teste se fetch é chamada e dados são exibidos', async () => {
    await flushPromises();
    renderPath(testMeal);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const recipeTitle = screen.getByTestId('recipe-title');
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeTitle).toHaveTextContent(oneMeal.meals[0].strMeal);
    const ingredients = screen.queryAllByTestId(/ingredient-name-and-measure/i);
    expect(ingredients).toHaveLength(8);
  });
  test('Teste se comida é compartilhada e usuário é redirecionado para tela de receita em andamento', async () => {
    await flushPromises();
    renderPath(testMeal);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const shareButton = screen.getByTestId('share-btn');
    window.document.execCommand = jest.fn().mockImplementation(() => ' ');
    userEvent.click(shareButton);
    const linkCopied = screen.getByText('Link copied!');
    expect(linkCopied).toBeInTheDocument();
    const startRecipeBtn = screen.getByTestId(startRecipeBtnId);
    userEvent.click(startRecipeBtn);
    expect(window.location.pathname).toBe('/meals/52771/in-progress');
    jest.clearAllMocks();
  });
  test('Teste se comida é favoritada quando clica no botão', async () => {
    await flushPromises();
    renderPath(testMeal);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const favoriteButton = screen.getByTestId('favorite-btn');
    userEvent.click(favoriteButton);
    const favoriteImages = screen.queryAllByRole('img');
    const favoriteImage = favoriteImages
      .find((image) => image.getAttribute('alt') === favoriteIconId);
    expect(favoriteImage).toHaveAttribute('src', blackHeartIcon);
  });
});

describe('Testar se a comida vem favoritada ou não e comportamento do botão Start Recipe', () => {
  beforeEach(() => {
    const mockMultFetch = jest.fn()
      .mockReturnValueOnce(mockFetch(oneMeal))
      .mockReturnValue(mockFetch(drinks));
    global.fetch = mockMultFetch;
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  test('Teste se a comida não vem favoritada', async () => {
    await flushPromises();
    // localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteMealRecipes));
    localStorage.removeItem('favoriteRecipes');
    renderPath(testMeal);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const favoriteImages = screen.queryAllByRole('img');
    const favoriteImage = favoriteImages
      .find((image) => image.getAttribute('alt') === favoriteIconId);
    expect(favoriteImage).toHaveAttribute('src', whiteHeartIcon);
  });
  test('Teste se a comida vem favoritada', async () => {
    await flushPromises();
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteMealRecipes));
    renderPath(testMeal);
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
    const favoriteImages = screen.queryAllByRole('img');
    const favoriteImage = favoriteImages
      .find((image) => image.getAttribute('alt') === favoriteIconId);
    expect(favoriteImage).toHaveAttribute('src', blackHeartIcon);
  });
  test('Teste se botão /Start Recipe/ desaparece', async () => {
    await flushPromises();
    localStorage.setItem('doneRecipes', JSON.stringify(doneMealRecipes));
    renderPath(testMeal);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const startRecipeButton = screen.queryByTestId(startRecipeBtnId);
    expect(startRecipeButton).not.toBeInTheDocument();
  });
});

describe('Testar detalhes da bebida', () => {
  beforeEach(() => {
    const mockMultFetchClipboard = jest.fn()
      .mockReturnValueOnce(mockFetch(oneDrink))
      .mockReturnValueOnce(mockFetch(meals))
      .mockReturnValue(mockClipboard);
    global.fetch = mockMultFetchClipboard;
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  test('Teste se fetch é chamada e dados são exibidos', async () => {
    await flushPromises();
    renderPath(testDrink);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const recipeTitle = screen.getByTestId('recipe-title');
    expect(recipeTitle).toBeInTheDocument();
    expect(recipeTitle).toHaveTextContent(oneDrink.drinks[0].strDrink);
    const ingredients = screen.queryAllByTestId(/ingredient-name-and-measure/i);
    expect(ingredients).toHaveLength(7);
  });
  test('Teste se bebida é compartilhada e usuário é redirecionado para tela de receita em andamento', async () => {
    await flushPromises();
    renderPath(testDrink);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const shareButton = screen.getByTestId('share-btn');
    window.document.execCommand = jest.fn().mockImplementation(() => ' ');
    userEvent.click(shareButton);
    const linkCopied = screen.getByText('Link copied!');
    expect(linkCopied).toBeInTheDocument();
    userEvent.click(shareButton);
    const startRecipeBtn = screen.getByTestId(startRecipeBtnId);
    userEvent.click(startRecipeBtn);
    expect(window.location.pathname).toBe('/drinks/178319/in-progress');
    jest.clearAllMocks();
  });
  test('Teste se bebida é favoritada ao clicar no botão', async () => {
    await flushPromises();
    renderPath(testDrink);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const favoriteButton = screen.getByTestId('favorite-btn');
    userEvent.click(favoriteButton);
    const favoriteImages = screen.queryAllByRole('img');
    const favoriteImage = favoriteImages
      .find((image) => image.getAttribute('alt') === favoriteIconId);
    expect(favoriteImage).toHaveAttribute('src', blackHeartIcon);
  });
});

describe('Testar se a bebida vem favoritada e comportamento do botão Start Recipe', () => {
  beforeEach(() => {
    const mockMultFetch = jest.fn()
      .mockReturnValueOnce(mockFetch(oneDrink))
      .mockReturnValue(mockFetch(meals));
    global.fetch = mockMultFetch;
  });
  afterEach(() => {
    global.fetch.mockClear();
  });
  test('Teste se a bebida não vem favoritada', async () => {
    await flushPromises();
    localStorage.removeItem('favoriteRecipes');
    renderPath(testDrink);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const favoriteImages = screen.queryAllByRole('img');
    const favoriteImage = favoriteImages
      .find((image) => image.getAttribute('alt') === favoriteIconId);
    expect(favoriteImage).toHaveAttribute('src', whiteHeartIcon);
  });
  test('Teste se a bebida vem favoritada', async () => {
    await flushPromises();
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteDrinkRecipes));
    renderPath(testDrink);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const favoriteImages = screen.queryAllByRole('img');
    const favoriteImage = favoriteImages
      .find((image) => image.getAttribute('alt') === favoriteIconId);
    expect(favoriteImage).toHaveAttribute('src', blackHeartIcon);
  });

  test('Teste se botão /Start Recipe/ desaparece', async () => {
    await flushPromises();
    localStorage.setItem('doneRecipes', JSON.stringify(doneDrinkRecipes));
    renderPath(testDrink);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    const startRecipeButton = screen.queryByTestId(startRecipeBtnId);
    expect(startRecipeButton).not.toBeInTheDocument();
  });
});
