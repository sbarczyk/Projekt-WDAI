# PROJEKT: Prosty sklep internetowy.
Projekt realizowany na potrzeby przedmiotu Wprowadzenie do aplikacji internetowych.  
Autorzy: Szymon Barczyk, Jan Dyląg


# SETUP
**1. Klonowanie repozytorium:**  
```
git clone https://github.com/sbarczyk/simple-store.git  
cd simple-store  

**2. Instalacja zalezności:**  
```
cd server  
npm install  
cd ../client  
npm install  

**3. Uruchomienie serwera:**  
cd server  
npm run dev  

**4. Uruchomienie aplikacji React:**  
cd client  
npm start  

**5. Dostęp do aplikacji: **  
	• Backend API: http://localhost:5001/api  
	• Frontend: http://localhost:3000  



# Użyta technologia i biblioteki

**Backend**  
	• Node.js: Serwer aplikacji.  
	• Express: Framework do obsługi routingu i middleware.  
	• Sequelize: ORM do zarządzania bazą danych (SQLite).  
	• jsonwebtoken: Obsługa tokenów JWT.  
	• bcryptjs: Szyfrowanie haseł.  
	• dotenv: Zarządzanie zmiennymi środowiskowymi.  
  
**Frontend**  
	• React: Biblioteka do budowy interfejsów użytkownika.  
	• React Router: Obsługa routingu po stronie klienta.  
	• Bootstrap: Biblioteka stylów.  
	• Axios: Komunikacja z backendem.  



# Funkcjonalności
**Funkcjonalny frontent z wykorzystaniem frameworku JS: React.**  

	1. Strona główna:  
	• Przyciągający wygląd i układ.  
	• Karuzela z wybranymi produktami.  
	• Linki do najważniejszych sekcji, jak lista produktów, logowanie, rejestracja itd. w panelu nawigacyjnym.  

	2. Lista produktów:  
	• Wyświetlanie wszystkich produktów z możliwością filtrowania po nazwie (wyszukiwanie).  
	• Produkty prezentowane w formie kart z obrazem, nazwą, ceną i opisem.  
	• Możliwość kliknięcia w produkt w celu przejścia do jego szczegółów.  
    • Dodanie do koszyka bezpośrednio z listy wszystkich produktów.  

	3. Szczegóły produktu:  
	• Informacje o nazwie, opisie, cenie.  
	• Formularz opinii (e-mail, treść, gwiazdki).  
        - walidacja formularza  
        - mozliwość usuwania/edytowania opinii (admin: wszystkie, user: nalezące do niego)  
        - uniemozliwienie uzytkownikowi dodania więcej niz jednej opini do danego produktu  
	• Możliwość dodania produktu do koszyka z określoną ilością.  

	4. Koszyk:  
	• Przegląd produktów dodanych do koszyka z możliwością edycji ilości i usuwania.  
	• Automatyczne obliczanie całkowitej wartości koszyka.  
	• Możliwość przejścia do finalizacji zamówienia.  

	5. Historia zamówień:  
	• Wyświetlenie listy zamówień użytkownika.  
	• Szczegóły każdego zamówienia z informacjami o produktach, ilości, cenach i statusie.  

	6. Panel administracyjny:  
	• Zarządzanie produktami: dodawanie, edycja, usuwanie.  
	• Przegląd wszystkich zamówień.  
	• Usuwanie opinii użytkowników.  

	7. Logowanie i rejestracja:  
	• Logowanie z obsługą JWT (z Refresh Tokenem).  
	• Rejestracja nowych użytkowników.  
	• Automatyczne przekierowanie na stronę logowania w przypadku braku dostępu.  

**Backend**  

	1. Operacje CRUD z wykorzystaniem bazy danych:  
	• Produkty: dodawanie, edytowanie, usuwanie, pobieranie.  
	• Opinie: dodawanie, edytowanie, usuwanie.  
	• Zamówienia: tworzenie, przeglądanie historii zamówień.  

	2. Zarządzanie użytkownikami:  
	• Rejestracja z hashowaniem haseł (bcryptjs).  
	• Logowanie z JWT.  
	• Obsługa Refresh Tokenów.  
    • Zachowana sesja uzytkownika.

	3. Obsługa autoryzacji:  
	• Middleware dla ochrony zasobów.  
	• Rozróżnienie uprawnień (admin vs zwykły użytkownik).  

	4. Baza danych:  
	• SQLite z ORM Sequelize.  
	• Relacje między produktami, zamówieniami i użytkownikami.  

    Dodatkowo:  
    • Dokumentacja POSTMAN.  
