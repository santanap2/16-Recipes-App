import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import storageDefault from './mocks/storageDefault';
import renderPath from './helpers/renderPath';
import mockFetch from './mocks/mockFetch';
import meals from '../../cypress/mocks/meals';
import drinks from '../../cypress/mocks/drinks';
import oneDrink from '../../cypress/mocks/oneDrink';
import emptyDrinks from '../../cypress/mocks/emptyDrinks';

const inputSearchId = 'search-input';
const nameSearchId = 'name-search-radio';
const ingredientSearchId = 'ingredient-search-radio';
const firstLetterId = 'first-letter-search-radio';
const execSearchButtonId = 'exec-search-btn';
const searchButtonId = 'search-top-btn';

const clickSearch = () => {
  const searchButton = screen.getByTestId(searchButtonId);
  expect(searchButton).toBeInTheDocument();
  userEvent.click(searchButton);
};

const getElements = () => {
  const ingredientRadio = screen.getByTestId(ingredientSearchId);
  const nameRadio = screen.getByTestId(nameSearchId);
  const letterRadio = screen.getByTestId(firstLetterId);
  const searchInput = screen.getByTestId(inputSearchId);
  const execSearchButton = screen.getByTestId(execSearchButtonId);
  return {
    ingredientRadio,
    nameRadio,
    letterRadio,
    searchInput,
    execSearchButton };
};

describe('Testar se SearchBar renderiza com todos os elementos', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify(storageDefault.user));
  });
  afterEach(() => localStorage.clear());

  test('Testa se SearchPage alterna renderização dos elementos quando botão de pesquisa é clicado', () => {
    renderPath('/meals');
    clickSearch();
    const {
      ingredientRadio, nameRadio,
      letterRadio, searchInput,
    } = getElements();
    expect(ingredientRadio).toBeInTheDocument();
    expect(nameRadio).toBeInTheDocument();
    expect(letterRadio).toBeInTheDocument();
    expect(searchInput).toBeInTheDocument();
    clickSearch();
    expect(searchInput).not.toBeInTheDocument();
  });
});

describe('Testar chamadas às API de meals', () => {
  test('Testa se fetch é chamada para busca de ingredientes em receitas de comidas', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(meals));
    renderPath('/meals');
    clickSearch();
    const {
      ingredientRadio, nameRadio,
      letterRadio, searchInput, execSearchButton,
    } = getElements();
    userEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();
    userEvent.click(letterRadio);
    expect(letterRadio).toBeChecked();
    userEvent.click(ingredientRadio);
    expect(ingredientRadio).toBeChecked();
    userEvent.type(searchInput, 'Onion');
    expect(searchInput).toHaveValue('Onion');
    userEvent.click(execSearchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    global.fetch.mockClear();
  });
  test('Testa se fetch é chamada para busca por primeira letra', async () => {
    jest.spyOn(global, 'alert');
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(meals));
    renderPath('/meals');
    clickSearch();
    const {
      letterRadio, searchInput, execSearchButton,
    } = getElements();
    userEvent.click(letterRadio);
    userEvent.type(searchInput, 'La');
    userEvent.click(execSearchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.alert).toHaveBeenCalled();
    userEvent.clear(searchInput);
    userEvent.type(searchInput, 'L');
    userEvent.click(execSearchButton);
    global.fetch.mockClear();
  });
});

describe('Testar chamadas à API de drinks', () => {
  test('Testa se fetch é chamada para busca de nomes em receitas de bebidas', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(drinks));
    renderPath('/drinks');
    clickSearch();
    const {
      nameRadio, searchInput, execSearchButton,
    } = getElements();
    userEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();
    userEvent.type(searchInput, 'Gin');
    userEvent.click(execSearchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    global.fetch.mockClear();
  });
  test('Testa se retornar apenas uma receita, o usuário é redirecionado para tela de detalhes', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(oneDrink));
    renderPath('/drinks');
    clickSearch();
    const {
      nameRadio, searchInput, execSearchButton,
    } = getElements();
    userEvent.click(nameRadio);
    expect(nameRadio).toBeChecked();
    userEvent.type(searchInput, 'Aquamarine');
    userEvent.click(execSearchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(window.location.pathname).toBe('/drinks/178319');
  });
  test('Testa se alert é mostrado se API retornar null', async () => {
    jest.spyOn(global, 'alert');
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetch(emptyDrinks));
    renderPath('/drinks');
    clickSearch();
    const {
      nameRadio, searchInput, execSearchButton,
    } = getElements();
    userEvent.click(nameRadio);
    userEvent.type(searchInput, 'xablau');
    userEvent.click(execSearchButton);
    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.alert).toHaveBeenCalled();
    global.fetch.mockClear();
  });
});
