document.addEventListener('DOMContentLoaded', async function () {
    if (localStorage.getItem('loggedIn') === undefined || localStorage.getItem('loggedIn') === null) {
        localStorage.setItem('loggedIn', 'false');
    }

    if (localStorage.getItem('host') === undefined || localStorage.getItem('host') === null) {
        localStorage.setItem('host', 'http://localhost:3000');
    }

    await Pages.headerComponent();
    if (localStorage.getItem('loggedIn') === 'true') {
        if (localStorage.getItem('role') === 'firm') {
            Firm.dashboard();
        }
        else {
            User.dashboard();
        }
    }
    else {
        Pages.loginPage();
    }
});


class General {
    static async selectActiveTab(name) {
        let links = document.querySelectorAll('.nav-link');

        links.forEach(link => {
            if (link.innerText === name) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    static async sendNotification(message, type) {
        let notificationBox = document.querySelector('.notification-box');

        let notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show`;
        notification.innerText = message;
        notificationBox.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    static async getBase64(file) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    static formatDate(date) {
        let d = new Date(date);
        return `${d.getDate().toString().padStart(2, 0)}.${(d.getMonth() + 1).toString().padStart(2, 0)}.${d.getFullYear()}`;
    }

    static formatDateTime(date) {
        let d = new Date(date);
        return `${d.getDate().toString().padStart(2, 0)}.${(d.getMonth() + 1).toString().padStart(2, 0)}.${d.getFullYear()} ${d.getHours().toString().padStart(2, 0)}:${d.getMinutes().toString().padStart(2, 0)}`;
    }

    static async sendMessage(id_job, message) {
        let data = {
            id_job: id_job,
            id_user: localStorage.getItem('id'),
            message: message,
            timestamp: parseInt(new Date().getTime() / 1000)
        };

        let response = await fetch(localStorage.getItem('host') + '/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        General.sendNotification('Mesajul a fost trimis cu success', 'success');
        if (localStorage.getItem('role') === 'firm') {
            Firm.myJobs();
        }
        else {
            User.myJobs();
        }
    }
}



class Pages {
    static async headerComponent() {
        let header = document.querySelector('header');
        header.innerHTML = '';

        let ul = document.createElement('ul');
        ul.className = 'nav nav-tabs';
        header.appendChild(ul);

        if (localStorage.getItem('loggedIn') === 'false') {
            let li = document.createElement('li');
            li.className = 'nav-item';
            ul.appendChild(li);

            let a = document.createElement('a');
            a.className = 'nav-link active';
            a.href = '#';
            a.innerText = 'Logare';
            a.onclick = Pages.loginPage;
            li.appendChild(a);

            li = document.createElement('li');
            li.className = 'nav-item';
            ul.appendChild(li);

            a = document.createElement('a');
            a.className = 'nav-link';
            a.href = '#';
            a.innerText = 'Inregistrare';
            a.onclick = Pages.registerPage;
            li.appendChild(a);
        }
        else {
            let li = document.createElement('li');
            li.className = 'nav-item';
            ul.appendChild(li);

            let a = document.createElement('a');
            a.className = 'nav-link';
            a.href = '#';
            a.innerText = 'Acasa';
            if (localStorage.getItem('role') === 'firm') {
                a.onclick = Firm.dashboard;
            }
            else {
                a.onclick = User.dashboard;
            }
            li.appendChild(a);

            if (localStorage.getItem('role') === 'firm') {
                li = document.createElement('li');
                li.className = 'nav-item';
                ul.appendChild(li);

                a = document.createElement('a');
                a.className = 'nav-link';
                a.href = '#';
                a.innerText = 'Profil';
                a.onclick = Firm.profile;
                li.appendChild(a);

                li = document.createElement('li');
                li.className = 'nav-item';
                ul.appendChild(li);

                a = document.createElement('a');
                a.className = 'nav-link';
                a.href = '#';
                a.innerText = 'Lucrari';
                a.onclick = Firm.myJobs;
                li.appendChild(a);

                li = document.createElement('li');
                li.className = 'nav-item';
                ul.appendChild(li);

                a = document.createElement('a');
                a.className = 'nav-link';
                a.href = '#';
                a.innerText = 'Statistici';
                a.onclick = Firm.stats;
                li.appendChild(a);
            }
            else if (localStorage.getItem('role') === 'client') {
                li = document.createElement('li');
                li.className = 'nav-item';
                ul.appendChild(li);

                a = document.createElement('a');
                a.className = 'nav-link';
                a.href = '#';
                a.innerText = 'Oferte';
                a.onclick = User.offers;
                li.appendChild(a);

                li = document.createElement('li');
                li.className = 'nav-item';
                ul.appendChild(li);

                a = document.createElement('a');
                a.className = 'nav-link';
                a.href = '#';
                a.innerText = 'Lucrari';
                a.onclick = User.myJobs;
                li.appendChild(a);

                li = document.createElement('li');
                li.className = 'nav-item';
                ul.appendChild(li);

                a = document.createElement('a');
                a.className = 'nav-link';
                a.href = '#';
                a.innerText = 'Recenzii';
                a.onclick = User.reviews;
                li.appendChild(a);
            }

            li = document.createElement('li');
            li.className = 'nav-item';
            ul.appendChild(li);

            a = document.createElement('a');
            a.className = 'nav-link';
            a.href = '#';
            a.innerText = 'Logout';
            a.onclick = Authentication.logout;
            li.appendChild(a);
        }
    }

    static async loginPage() {
        General.selectActiveTab('Logare');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let form = document.createElement('form');
        form.className = 'd-flex flex-column align-items-center p-4 border border-secondary rounded-4';
        form.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.3)';
        form.style.backgroundColor = 'white';
        form.style.marginTop = '295px';
        page.appendChild(form);

        let img = document.createElement('img');
        img.src = 'https://img.freepik.com/free-vector/isolated-tower-crane-cartoon-style_1308-104645.jpg';
        img.className = 'img-fluid';
        img.style.position = 'absolute';
        img.style.width = '454px';
        img.style.height = '626px';
        img.style.zIndex = '-1';
        img.style.marginLeft = '330px';
        page.appendChild(img);

        let h2 = document.createElement('h2');
        h2.innerText = 'Logare';
        form.appendChild(h2);

        let input = document.createElement('input');
        input.type = 'email';
        input.className = 'form-control mt-3';
        input.placeholder = 'Email';
        input.id = 'email';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'password';
        input.className = 'form-control mt-3';
        input.placeholder = 'Parola';
        input.id = 'password';
        form.appendChild(input);

        let a = document.createElement('a');
        a.href = '#';
        a.innerText = 'Am uitat parola?';
        a.className = 'mt-3 text-secondary w-100';
        a.onclick = Pages.forgot;
        form.appendChild(a);

        let button = document.createElement('button');
        button.type = 'submit';
        button.className = 'btn btn-primary mt-3';
        button.innerText = 'Logare';
        button.onclick = function (event) {
            event.preventDefault();
            Authentication.login();
        };
        form.appendChild(button);
    }

    static async forgot() {
        let main = document.querySelector('main');
        main.innerHTML = '';

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let form = document.createElement('form');
        form.className = 'd-flex flex-column align-items-center p-4 border border-secondary rounded-4';
        form.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.3)';
        page.appendChild(form);

        let h2 = document.createElement('h2');
        h2.innerText = 'Recuperare parola';
        form.appendChild(h2);

        let input = document.createElement('input');
        input.type = 'email';
        input.className = 'form-control mt-3';
        input.placeholder = 'Email';
        input.id = 'email';
        form.appendChild(input);

        let span = document.createElement('span');
        span.className = 'text-secondary mt-3';
        span.innerHTML = 'Trimite cod';
        span.style.cursor = 'pointer';
        span.onclick = Authentication.sendCode;
        form.appendChild(span);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mt-3';
        input.placeholder = 'Cod de recuperare';
        input.id = 'recovery_code';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'password';
        input.className = 'form-control mt-3';
        input.placeholder = 'Parola noua';
        input.id = 'new_password';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'password';
        input.className = 'form-control mt-3';
        input.placeholder = 'Confirma parola noua';
        input.id = 'confirm_new_password';
        form.appendChild(input);

        let a = document.createElement('a');
        a.href = '#';
        a.innerText = 'Am deja cont';
        a.className = 'mt-3 text-secondary w-100';
        a.onclick = Pages.loginPage;
        form.appendChild(a);

        let button = document.createElement('button');
        button.className = 'btn btn-primary mt-3';
        button.innerText = 'Resetare parola';
        button.onclick = Authentication.resetPassword;
        form.appendChild(button);
    }

    static async registerPage() {
        General.selectActiveTab('Inregistrare');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let form = document.createElement('form');
        form.className = 'd-flex flex-column align-items-center p-4 border border-secondary rounded-4 mt-5';
        form.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.3)';
        page.appendChild(form);

        let img = document.createElement('img');
        img.src = "https://www.planttalk.co.uk/attachments/1731429884383-png.66335/";
        img.className = 'img-fluid';
        img.style.position = 'absolute';
        img.style.width = '600px';
        img.style.height = '375px';
        img.style.zIndex = '-1';
        img.style.marginLeft = '790px';
        img.style.marginTop = '220px';
        page.appendChild(img);

        let h2 = document.createElement('h2');
        h2.innerText = 'Inregistrare';
        form.appendChild(h2);

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mt-3';
        input.placeholder = 'Nume';
        input.id = 'last_name';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control mt-3';
        input.placeholder = 'Prenume';
        input.id = 'first_name';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'email';
        input.className = 'form-control mt-3';
        input.placeholder = 'Email';
        input.id = 'email';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'password';
        input.className = 'form-control mt-3';
        input.placeholder = 'Parola';
        input.id = 'password';
        form.appendChild(input);

        input = document.createElement('input');
        input.type = 'password';
        input.className = 'form-control mt-3';
        input.placeholder = 'Confirma parola';
        input.id = 'confirm_password';
        form.appendChild(input);

        let row = document.createElement('div');
        row.className = 'd-flex flex-row align-items-center w-100 mt-3';
        form.appendChild(row);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'firm';
        row.appendChild(checkbox);

        let label = document.createElement('label');
        label.htmlFor = 'firm';
        label.innerText = 'Sunt prestator';
        label.className = 'ms-2 fw-bold text-secondary';
        row.appendChild(label);

        let button = document.createElement('button');
        button.type = 'submit';
        button.className = 'btn btn-primary mt-3';
        button.innerText = 'Inregistrare';
        button.onclick = function (event) {
            event.preventDefault();
            Authentication.register();
        };
        form.appendChild(button);
    }
}



class Authentication {
    static async register() {
        let last_name = document.getElementById('last_name').value;
        let first_name = document.getElementById('first_name').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let confirm_password = document.getElementById('confirm_password').value;
        let firm = document.getElementById('firm').checked;

        if (last_name === '' || first_name === '' || email === '' || password === '' || confirm_password === '') {
            General.sendNotification('Toate campurile sunt obligatorii!', 'danger');
            return;
        }

        if (password !== confirm_password) {
            General.sendNotification('Parolele nu coincid!', 'danger');
            return;
        }

        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        if (!emailPattern.test(email)) {
            General.sendNotification('Email invalid!', 'danger');
            return;
        }

        if (password.length < 8) {
            General.sendNotification('Parola trebuie sa aiba cel putin 8 caractere!', 'danger');
            return;
        }

        if (!/[a-z]/.test(password)) {
            General.sendNotification('Parola trebuie sa contina cel putin o litera mica!', 'danger');
            return;
        }

        if (!/[A-Z]/.test(password)) {
            General.sendNotification('Parola trebuie sa contina cel putin o litera mare!', 'danger');
            return;
        }

        if (!/\d/.test(password)) {
            General.sendNotification('Parola trebuie sa contina cel putin o cifra!', 'danger');
            return;
        }

        if (!/\W/.test(password)) {
            General.sendNotification('Parola trebuie sa contina cel putin un caracter special!', 'danger');
            return;
        }

        let data = {
            last_name: last_name,
            first_name: first_name,
            email: email,
            password: password,
            firm: firm
        };

        let response = await fetch(localStorage.getItem('host') + '/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        if (result.registered === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        General.sendNotification(result.message, 'success');
        Pages.loginPage();
    }

    static async login() {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if (email === '' || password === '') {
            General.sendNotification('Toate campurile sunt obligatorii!', 'danger');
            return;
        }

        let data = {
            email: email,
            password: password
        };

        let response = await fetch(localStorage.getItem('host') + '/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        if (result.authenticated === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('id', result.id);
        localStorage.setItem('role', result.role);

        await Pages.headerComponent();
        if (result.role === 'firm') {
            Firm.dashboard();
        } else {
            User.dashboard();
        }
    }

    static async logout() {
        localStorage.setItem('loggedIn', 'false');
        localStorage.removeItem('id');
        localStorage.removeItem('role');
        await Pages.headerComponent();
        Pages.loginPage();
    }

    static async resetPassword() {
        let email = document.getElementById('email').value;
        let recovery_code = document.getElementById('recovery_code').value;
        let new_password = document.getElementById('new_password').value;
        let confirm_new_password = document.getElementById('confirm_new_password').value;

        if (email === '' || recovery_code === '' || new_password === '' || confirm_new_password === '') {
            General.sendNotification('Toate campurile sunt obligatorii!', 'danger');
            return;
        }

        if (new_password.length < 8) {
            General.sendNotification('Parola trebuie sa aiba cel putin 8 caractere!', 'danger');
            return;
        }

        if (!/[a-z]/.test(new_password)) {
            General.sendNotification('Parola trebuie sa contina cel putin o litera mica!', 'danger');
            return;
        }

        if (!/[A-Z]/.test(new_password)) {
            General.sendNotification('Parola trebuie sa contina cel putin o litera mare!', 'danger');
            return;
        }

        if (!/\d/.test(new_password)) {
            General.sendNotification('Parola trebuie sa contina cel putin o cifra!', 'danger');
            return;
        }

        if (!/\W/.test(new_password)) {
            General.sendNotification('Parola trebuie sa contina cel putin un caracter special!', 'danger');
            return;
        }

        if (new_password !== confirm_new_password) {
            General.sendNotification('Parolele nu coincid!', 'danger');
            return;
        }

        let data = {
            email: email,
            code: recovery_code,
            new_password: new_password
        };

        let response = await fetch(localStorage.getItem('host') + '/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        General.sendNotification(result.message, 'success');
        Pages.loginPage();

    }

    static async sendCode() {
        let email = document.getElementById('email').value;

        if (email === '') {
            General.sendNotification('Emailul este obligatoriu!', 'danger');
            return;
        }

        let data = {
            email: email
        };

        let response = await fetch(localStorage.getItem('host') + '/sendCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        General.sendNotification(result.message, 'success');
    }
}


class Firm {
    static async dashboard() {
        General.selectActiveTab('Acasa');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let data;

        let response = await fetch(localStorage.getItem('host') + '/getJobs?id=' + localStorage.getItem('id'));
        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        data = result.data;

        let map = document.createElement('div');
        map.id = 'map';
        map.className = 'mt-3';
        map.style.width = '100%';
        map.style.height = '500px';
        page.appendChild(map);

        let lat = parseFloat(data.lat || '44.426767');
        let lng = parseFloat(data.lng || '26.102538');

        let mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 13
        };

        let googleMap = new google.maps.Map(map, mapOptions);

        for (let job of data) {
            let marker = new google.maps.Marker({
                position: new google.maps.LatLng(job.lat, job.lng),
                map: googleMap,
                draggable: false
            });

            let infoWindow = new google.maps.InfoWindow({
                content: `<h5>${job.title}</h5><p>${job.max_price} RON</p>`
            });

            marker.addListener('click', () => {
                infoWindow.open(googleMap, marker);
            });
        }

        for (let job of data) {
            let section = document.createElement('section');
            section.className = 'd-flex flex-column align-items-center p-4 rounded-4 mt-5 w-100';
            section.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.3)';
            section.style.border = '4px solid #555';
            section.style.borderRadius = '8px';
            page.appendChild(section);

            let h2 = document.createElement('h2');
            h2.innerText = job.title;
            section.appendChild(h2);

            let text = document.createElement('p');
            text.innerText = job.description;
            section.appendChild(text);

            let row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around';
            section.appendChild(row);

            let box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let label = document.createElement('label');
            label.innerText = 'Data inceput:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            let span = document.createElement('span');
            span.innerText = General.formatDate(job.start_date);
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Buget:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.max_price + ' RON';
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
            section.appendChild(row);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let img = document.createElement('img');
            img.src = job.img1;
            img.className = 'img-fluid border border-secondary rounded-4';
            img.style.maxWidth = '200px';
            box.appendChild(img);

            if (job.img2 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img2;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img3 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img3;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img4 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img4;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img5 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img5;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img6 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img6;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img7 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img7;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img8 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img8;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
            section.appendChild(row);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Zile pana la realizare:';
            label.className = 'fw-bold fs-5 text-nowrap text-secondary';
            box.appendChild(label);

            let input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control ms-2';
            input.name = 'days';
            box.appendChild(input);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Pret propus:';
            label.className = 'fw-bold fs-5 text-nowrap text-secondary';
            box.appendChild(label);

            input = document.createElement('input');
            input.type = 'number';
            input.className = 'form-control ms-2';
            input.name = 'price';
            box.appendChild(input);

            let button = document.createElement('button');
            button.className = 'btn-construction btn-hazard mt-3';
            button.innerText = 'Liciteaza';
            button.onclick = () => {
                let section = button.parentElement;
                let days = section.querySelector('input[name="days"]').value;
                let price = section.querySelector('input[name="price"]').value;
                Firm.bid(job.id, days, price);
            };
            section.appendChild(button);
        }
    }

    static async bid(job_id, days, price) {
        if (days === '' || price === '') {
            General.sendNotification('Toate campurile sunt obligatorii!', 'danger');
            return;
        }

        let data = {
            id_job: job_id,
            id_user: localStorage.getItem('id'),
            days: days,
            price: price
        };

        let response = await fetch(localStorage.getItem('host') + '/bid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            return;
        }

        General.sendNotification('Licitatia a fost plasata cu success', 'success');
        Firm.dashboard();
    }

    static async profile() {
        General.selectActiveTab('Profil');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let data;

        try {
            let response = await fetch(localStorage.getItem('host') + '/getFirmProfile?id=' + localStorage.getItem('id'));
            let result = await response.json();

            if (result.status === false) {
                General.sendNotification(result.message, 'danger');
                console.error(result.error);
                return;
            }

            data = result.data;
        } catch (error) {
            console.error(error);
            General.sendNotification('A aparut o eroare!', 'danger');
            return;
        }

        if (data === null) {
            data = {};
        }

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let section = document.createElement('section');
        section.className = 'd-flex flex-column align-items-center p-4 border border-secondary rounded-4 mt-5 w-100';
        section.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.5)';
        page.appendChild(section);

        let h2 = document.createElement('h2');
        h2.innerText = 'Datele firmei';
        section.appendChild(h2);

        let row = document.createElement('div');
        row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
        section.appendChild(row);

        let box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        let label = document.createElement('label');
        label.innerText = 'Nume firma:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.name || '';
        input.id = 'name';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'CUI:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.CUI || '';
        input.id = 'CUI';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Tara:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.country || '';
        input.id = 'country';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Judet:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.district || '';
        input.id = 'district';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Oras:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.city || '';
        input.id = 'city';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Strada:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.street || '';
        input.id = 'street';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Numar strada:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.street_number || '';
        input.id = 'street_number';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Bloc:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.block || '';
        input.id = 'block';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Scara:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.entrance || '';
        input.id = 'entrance';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Etaj:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.floor || '';
        input.id = 'floor';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Apartament:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.apartment || '';
        input.id = 'apartment';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Telefon:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = data.phone || '';
        input.id = 'phone';
        box.appendChild(input);

        let map = document.createElement('div');
        map.id = 'map';
        map.className = 'mt-3';
        map.style.width = '100%';
        map.style.height = '400px';
        section.appendChild(map);

        let lat = parseFloat(data.lat || '44.426767');
        let lng = parseFloat(data.lng || '26.102538');

        let mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 15
        };

        let googleMap = new google.maps.Map(map, mapOptions);

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: googleMap,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
            document.getElementById('lat').value = event.latLng.lat();
            document.getElementById('lng').value = event.latLng.lng();
        });

        row = document.createElement('div');
        row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around';
        section.appendChild(row);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Latitudine:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = lat;
        input.id = 'lat';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Longitudine:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = lng;
        input.id = 'lng';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Raza (m)';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control ms-2';
        input.id = 'radius';
        input.value = data.radius || '5000';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Logo:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'file';
        input.className = 'form-control ms-2';
        input.id = 'logo';
        box.appendChild(input);


        let button = document.createElement('button');
        button.className = 'btn btn-primary mt-3';
        button.innerText = 'Salvare';
        button.onclick = Firm.saveProfile;
        section.appendChild(button);
    }

    static async saveProfile() {
        let name = document.getElementById('name').value;
        let CUI = document.getElementById('CUI').value;
        let country = document.getElementById('country').value;
        let district = document.getElementById('district').value;
        let city = document.getElementById('city').value;
        let street = document.getElementById('street').value;
        let street_number = document.getElementById('street_number').value;
        let block = document.getElementById('block').value;
        let entrance = document.getElementById('entrance').value;
        let floor = document.getElementById('floor').value;
        let apartment = document.getElementById('apartment').value;
        let phone = document.getElementById('phone').value;
        let lat = document.getElementById('lat').value;
        let lng = document.getElementById('lng').value;
        let radius = document.getElementById('radius').value;
        let logo = document.getElementById('logo').files[0];

        if (name === '' || CUI === '' || country === '' || district === '' || city === '' || street === '' || street_number === '' || phone === '' || lat === '' || lng === '' || radius === '') {
            General.sendNotification('Toate campurile sunt obligatorii!', 'danger');
            return;
        }

        if (logo === undefined) {
            General.sendNotification('Logo-ul este obligatoriu!', 'danger');
            return;
        }

        let data = {
            id: localStorage.getItem('id'),
            name: name,
            CUI: CUI,
            country: country,
            district: district,
            city: city,
            street: street,
            street_number: street_number,
            block: block,
            entrance: entrance,
            floor: floor,
            apartment: apartment,
            phone: phone,
            lat: lat,
            lng: lng,
            radius: radius,
            logo: await General.getBase64(logo)
        }

        let response = await fetch(localStorage.getItem('host') + '/saveFirmProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        General.sendNotification('Profilul a fost salvat cu success', 'success');
    }

    static async myJobs() {
        General.selectActiveTab('Lucrari');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let response = await fetch(localStorage.getItem('host') + '/getFirmJobs?id=' + localStorage.getItem('id'));
        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        let data = result.data;

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        for (let job of data) {
            let section = document.createElement('section');
            section.className = 'd-flex flex-column align-items-center p-4 rounded-4 mt-5 w-100';
            section.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.3)';
            section.style.border = '4px solid #555';
            section.style.borderRadius = '8px';
            page.appendChild(section);

            let h2 = document.createElement('h2');
            h2.innerText = job.title;
            section.appendChild(h2);

            let text = document.createElement('p');
            text.innerText = job.description;
            section.appendChild(text);

            let row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around';
            section.appendChild(row);

            let box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let label = document.createElement('label');
            label.innerText = 'Data inceput:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            let span = document.createElement('span');
            span.innerText = General.formatDate(job.start_date);
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Buget:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.price + ' RON';
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Zile pentru realizare:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.days;
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Zile ramase:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            let currentDate = new Date();
            let deliveryDate = new Date(job.start_date);
            deliveryDate = deliveryDate.getTime();
            deliveryDate += job.days * 24 * 60 * 60 * 1000;
            deliveryDate = Math.floor(deliveryDate / 1000);
            currentDate = currentDate.getTime();
            currentDate = Math.floor(currentDate / 1000);
            let daysLeft = Math.floor((deliveryDate - currentDate) / (24 * 60 * 60));

            span = document.createElement('span');
            span.innerText = daysLeft;
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Status:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            let select = document.createElement('select');
            select.className = 'form-control ms-2';
            select.onchange = () => {
                Firm.changeStatus(job.id, select.value);
            }
            box.appendChild(select);

            let option = document.createElement('option');
            option.value = 'pending';
            option.innerText = 'In asteptare';
            if (job.status === 'pending') {
                option.selected = true;
            }
            select.appendChild(option);

            option = document.createElement('option');
            option.value = 'progress';
            option.innerText = 'In lucru';
            if (job.status === 'progress') {
                option.selected = true;
            }
            select.appendChild(option);

            option = document.createElement('option');
            option.value = 'done';
            option.innerText = 'Finalizat';
            if (job.status === 'done') {
                option.selected = true;
            }
            select.appendChild(option);

            row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
            section.appendChild(row);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let img = document.createElement('img');
            img.src = job.img1;
            img.className = 'img-fluid border border-secondary rounded-4';
            img.style.maxWidth = '200px';
            box.appendChild(img);

            if (job.img2 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img2;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img3 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img3;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img4 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img4;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img5 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img5;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img6 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img6;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img7 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img7;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img8 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img8;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            let chatArea = document.createElement('div');
            chatArea.className = 'd-flex flex-column align-items-center w-100 mt-3';
            chatArea.style.height = '400px';
            chatArea.style.overflowY = 'scroll';
            section.appendChild(chatArea);

            let messages = JSON.parse(job.messages);

            if (messages.length === 0) {
                let messageBox = document.createElement('div');
                messageBox.className = 'd-flex flex-column align-items-center w-75 mt-2';
                messageBox.innerHTML = 'Niciun mesaj';
                chatArea.appendChild(messageBox);
            }
            else {
                for (let message of messages) {
                    let messageBox = document.createElement('div');
                    messageBox.className = 'd-flex flex-column align-items-center w-75 mt-2 border border-secondary rounded-4 p-2';
                    chatArea.appendChild(messageBox);

                    let span = document.createElement('span');
                    span.innerText = message.name + ': ' + General.formatDateTime(new Date(parseInt(message.timestamp) * 1000));
                    span.className = 'fw-bold text-secondary fs-5 text-nowrap bg-light w-100';
                    messageBox.appendChild(span);

                    let p = document.createElement('p');
                    p.innerText = message.message;
                    p.className = 'text-center mt-2 w-100 p-2';
                    p.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
                    messageBox.appendChild(p);
                }
            }

            chatArea.scrollTop = chatArea.scrollHeight;

            let messageBox = document.createElement('div');
            messageBox.className = 'd-flex flex-row align-items-center w-100 mt-3';
            section.appendChild(messageBox);

            let input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.name = 'message';
            input.placeholder = 'Mesaj';
            messageBox.appendChild(input);

            let button = document.createElement('button');
            button.className = 'btn-industrial ms-2';
            button.innerHTML = '<i class="bi bi-airplane-engines"></i> Trimite';
            button.onclick = () => { General.sendMessage(job.id, input.value) };
            messageBox.appendChild(button);
        }
    }

    static async changeStatus(job_id, status) {
        let data = {
            id: job_id,
            status: status
        };

        let response = await fetch(localStorage.getItem('host') + '/changeJobStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        General.sendNotification('Statusul a fost schimbat cu success', 'success');
    }

    static async stats() {
        General.selectActiveTab('Statistici');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let response = await fetch(localStorage.getItem('host') + '/getHistory?id=' + localStorage.getItem('id'));
        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        let data = result.data;

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '400px';
        div.className = 'chart-container';
        page.appendChild(div);

        let canvas = document.createElement('canvas');
        canvas.id = 'gradesChart';
        canvas.style.height = '300px';
        canvas.style.width = '100%';
        canvas.className = 'mt-5';
        div.appendChild(canvas);

        let labels = [];
        let values = [];

        for (let item of data) {
            console.log(item);
            labels.push(item.title);
            values.push(item.grade);
        }

        if (values.length > 20) {
            labels = labels.slice(0, 20);
            values = values.slice(0, 20);
        }

        let ctx = document.getElementById('gradesChart').getContext('2d');

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nota',
                    data: values,
                    backgroundColor: 'rgba(255, 69, 0, 0.8)',
                    borderColor: 'rgba(255, 69, 0, 1)',
                    borderWidth: 2,
                    barThickness: 30,
                    hoverBackgroundColor: 'rgba(255, 0, 0, 1)',
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: '#444',
                            borderColor: '#222',
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff',
                            font: {
                                size: 14
                            }
                        },
                        grid: {
                            color: '#444',
                            borderColor: '#222',
                        }
                    }
                }
            }
        });

        div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '400px';
        div.className = 'chart-container';
        page.appendChild(div);

        canvas = document.createElement('canvas');
        canvas.id = 'revenuesChart';
        canvas.style.height = '300px';
        canvas.style.width = '100%';
        canvas.className = 'mt-5';
        div.appendChild(canvas);

        labels = [];
        values = [];

        for (let item of data) {
            labels.push(item.title);
            values.push(item.price);
        }

        if (values.length > 20) {
            labels = labels.slice(0, 20);
            values = values.slice(0, 20);
        }

        ctx = document.getElementById('revenuesChart').getContext('2d');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Suma',
                    data: values,
                    backgroundColor: 'rgba(255, 69, 0, 0.5)',
                    borderColor: 'rgba(255, 69, 0, 1)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#fff',
                            font: { size: 14 }
                        },
                        grid: {
                            color: '#444',
                            borderColor: '#222',
                        }
                    },
                    x: {
                        ticks: {
                            color: '#fff',
                            font: { size: 14 }
                        },
                        grid: {
                            color: '#444',
                            borderColor: '#222',
                        }
                    }
                }
            }
        });

        let table = document.createElement('table');
        table.className = 'table';
        page.appendChild(table);

        let thead = document.createElement('thead');
        table.appendChild(thead);

        let tr = document.createElement('tr');
        thead.appendChild(tr);

        let th = document.createElement('th');
        th.innerText = 'Lucrare';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerText = 'Nota';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerText = 'Suma';
        tr.appendChild(th);

        th = document.createElement('th');
        th.innerText = 'Data';
        tr.appendChild(th);

        let tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (let item of data) {
            tr = document.createElement('tr');
            tbody.appendChild(tr);

            let td = document.createElement('td');
            td.innerText = item.title;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerText = item.grade;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerText = item.price;
            tr.appendChild(td);

            td = document.createElement('td');
            td.innerText = General.formatDate(item.start_date);
            tr.appendChild(td);
        }
    }
}


class User {
    static async dashboard() {
        General.selectActiveTab('Acasa');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let section = document.createElement('section');
        section.className = 'd-flex flex-column align-items-center p-4 rounded-4 mt-5 w-100';
        section.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.3)';
        section.style.border = '4px solid #555';
        section.style.borderRadius = '8px';
        page.appendChild(section);

        let h2 = document.createElement('h2');
        h2.innerText = 'Posteaza o lucrare';
        section.appendChild(h2);

        let row = document.createElement('div');
        row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
        section.appendChild(row);

        let box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        let label = document.createElement('label');
        label.innerText = 'Titlu lucrare:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.id = 'title';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Descriere lucrare:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('textarea');
        input.className = 'form-control ms-2';
        input.id = 'description';
        input.rows = 5;
        input.cols = 50;
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Data inceput:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'date';
        input.className = 'form-control ms-2';
        input.id = 'start_date';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Buget:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'number';
        input.className = 'form-control ms-2';
        input.id = 'budget';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        section.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Imagini (maxim 8):';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'file';
        input.className = 'form-control ms-2';
        input.id = 'images';
        input.multiple = true;
        box.appendChild(input);

        let map = document.createElement('div');
        map.id = 'map';
        map.className = 'mt-3';
        map.style.width = '100%';
        map.style.height = '400px';
        section.appendChild(map);

        let lat = 44.426767;
        let lng = 26.102538;

        let mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 15
        };

        let googleMap = new google.maps.Map(map, mapOptions);

        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: googleMap,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
            document.getElementById('lat').value = event.latLng.lat();
            document.getElementById('lng').value = event.latLng.lng();
        });

        row = document.createElement('div');
        row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around';
        section.appendChild(row);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Latitudine:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = lat;
        input.id = 'lat';
        box.appendChild(input);

        box = document.createElement('div');
        box.className = 'd-flex flex-row align-items-center mx-2 mt-3';
        row.appendChild(box);

        label = document.createElement('label');
        label.innerText = 'Longitudine:';
        label.className = 'fw-bold text-secondary fs-5 text-nowrap';
        box.appendChild(label);

        input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control ms-2';
        input.value = lng;
        input.id = 'lng';
        box.appendChild(input);

        let button = document.createElement('button');
        button.className = 'btn-construction btn-industrial mt-3';
        button.innerText = 'Posteaza';
        button.onclick = User.postJob;
        section.appendChild(button);
    }

    static async postJob() {
        let title = document.getElementById('title').value;
        let description = document.getElementById('description').value;
        let start_date = document.getElementById('start_date').value;
        let budget = document.getElementById('budget').value;
        let images = document.getElementById('images').files;
        let lat = document.getElementById('lat').value;
        let lng = document.getElementById('lng').value;

        if (title === '' || description === '' || start_date === '' || budget === '' || images.length === 0 || lat === '' || lng === '') {
            General.sendNotification('Toate campurile sunt obligatorii!', 'danger');
            return;
        }

        if (images.length > 8) {
            General.sendNotification('Maxim 8 imagini!', 'danger');
            return;
        }

        let data = {
            user_id: localStorage.getItem('id'),
            title: title,
            description: description,
            start_date: start_date,
            budget: budget,
            lat: lat,
            lng: lng,
            img1: await General.getBase64(images[0]),
            img2: images.length > 1 ? await General.getBase64(images[1]) : '',
            img3: images.length > 2 ? await General.getBase64(images[2]) : '',
            img4: images.length > 3 ? await General.getBase64(images[3]) : '',
            img5: images.length > 4 ? await General.getBase64(images[4]) : '',
            img6: images.length > 5 ? await General.getBase64(images[5]) : '',
            img7: images.length > 6 ? await General.getBase64(images[6]) : '',
            img8: images.length > 7 ? await General.getBase64(images[7]) : ''
        };

        let response = await fetch(localStorage.getItem('host') + '/postJob', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        General.sendNotification('Lucrarea a fost postata cu success', 'success');
    }

    static async offers() {
        General.selectActiveTab('Oferte');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        let response = await fetch(localStorage.getItem('host') + '/getOffers?id=' + localStorage.getItem('id'));
        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        let data = result.data;

        for (let job of data) {
            let section = document.createElement('section');
            section.className = 'd-flex flex-column align-items-center p-4 rounded-4 mt-5 w-100';
            section.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.3)';
            section.style.border = '4px solid #555';
            section.style.borderRadius = '8px';
            page.appendChild(section);

            let h2 = document.createElement('h2');
            h2.innerText = job.title;
            section.appendChild(h2);

            let row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around';
            section.appendChild(row);

            let box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let label = document.createElement('label');
            label.innerText = 'Data inceput:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            let span = document.createElement('span');
            span.innerText = General.formatDate(job.start_date);
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Buget:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.max_price + ' RON';
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            let table = document.createElement('table');
            table.className = 'table table-striped table-bordered mt-3 text-center';
            section.appendChild(table);

            let thead = document.createElement('thead');
            table.appendChild(thead);

            let tr = document.createElement('tr');
            thead.appendChild(tr);

            let th = document.createElement('th');
            th.innerText = 'Oferte';
            th.colSpan = 5;
            tr.appendChild(th);

            tr = document.createElement('tr');
            thead.appendChild(tr);

            th = document.createElement('th');
            th.innerText = 'Firma';
            tr.appendChild(th);

            th = document.createElement('th');
            th.innerText = 'Zile de executie';
            th.className = 'text-nowrap';
            tr.appendChild(th);

            th = document.createElement('th');
            th.innerText = 'Pret';
            th.className = 'text-nowrap';
            tr.appendChild(th);

            th = document.createElement('th');
            th.innerText = 'Nota';
            th.className = 'text-nowrap';
            tr.appendChild(th);

            th = document.createElement('th');
            th.innerText = 'Actiuni';
            th.className = 'text-nowrap';
            tr.appendChild(th);

            let tbody = document.createElement('tbody');
            table.appendChild(tbody);

            for (let offer of job.bids) {
                tr = document.createElement('tr');
                tbody.appendChild(tr);

                let td = document.createElement('td');
                td.innerText = offer.name;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerText = offer.days;
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerText = offer.price + ' RON';
                tr.appendChild(td);

                td = document.createElement('td');
                td.innerText = offer.rating;
                tr.appendChild(td);

                td = document.createElement('td');
                tr.appendChild(td);

                let button = document.createElement('button');
                button.className = 'btn-construction btn-hazard';
                button.innerText = 'Accepta';
                button.onclick = () => User.acceptOffer(offer.id);
                td.appendChild(button);
            }
        }
    }

    static async acceptOffer(offer_id) {
        let data = {
            id_bid: offer_id
        };

        let response = await fetch(localStorage.getItem('host') + '/acceptOffer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        General.sendNotification('Oferta a fost acceptata cu success', 'success');
        User.offers();
    }

    static async myJobs() {
        General.selectActiveTab('Lucrari');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let response = await fetch(localStorage.getItem('host') + '/getJobsClient?id=' + localStorage.getItem('id'));
        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        let data = result.data;

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        for (let job of data) {
            let section = document.createElement('section');
            section.className = 'd-flex flex-column align-items-center p-4 rounded-4 mt-5 w-100';
            section.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.3)';
            section.style.border = '4px solid #555';
            section.style.borderRadius = '8px';
            page.appendChild(section);

            let h2 = document.createElement('h2');
            h2.innerText = job.title;
            section.appendChild(h2);

            let text = document.createElement('p');
            text.innerText = job.description;
            section.appendChild(text);

            let row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
            section.appendChild(row);

            let box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let label = document.createElement('label');
            label.innerText = 'Data inceput:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            let span = document.createElement('span');
            span.innerText = General.formatDate(job.start_date);
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Suma acceptata:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.price + ' RON';
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
            section.appendChild(row);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Firma:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.name;
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Zile de executie:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            span.innerText = job.days;
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            label = document.createElement('label');
            label.innerText = 'Status:';
            label.className = 'fw-bold fs-5 text-nowrap';
            box.appendChild(label);

            span = document.createElement('span');
            if (job.status === 'pending') {
                span.innerText = 'In asteptare';
            }
            else if (job.status === 'progress') {
                span.innerText = 'In desfasurare';
            }
            else if (job.status === 'done') {
                span.innerText = 'Finalizata';
            }
            span.className = 'ms-2 fw-bold text-secondary fs-5 text-nowrap';
            box.appendChild(span);

            if (job.status === 'done') {
                row = document.createElement('div');
                row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
                section.appendChild(row);

                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                label = document.createElement('label');
                label.innerText = 'Evalueaza firma:';
                label.className = 'fw-bold fs-5 text-nowrap';
                box.appendChild(label);

                let select = document.createElement('select');
                select.className = 'form-control ms-2';
                box.appendChild(select);

                for (let i = 1; i <= 10; i++) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.innerText = i;
                    select.appendChild(option);
                }

                let textareaReview = document.createElement('textarea');
                textareaReview.className = 'form-control mt-3 ms-3 w-50';
                textareaReview.placeholder = 'Review';
                row.appendChild(textareaReview);

                let button = document.createElement('button');
                button.className = 'btn-industrial mt-3';
                button.innerHTML = '<i class="bi bi-airplane-engines"></i>Evalueaza';
                button.onclick = () => User.rate(job.id, select.value, textareaReview.value);
                row.appendChild(button);
            }

            row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-around flex-wrap';
            section.appendChild(row);

            box = document.createElement('div');
            box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
            row.appendChild(box);

            let img = document.createElement('img');
            img.src = job.img1;
            img.className = 'img-fluid border border-secondary rounded-4';
            img.style.maxWidth = '200px';
            box.appendChild(img);

            if (job.img2 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img2;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img3 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img3;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img4 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img4;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img5 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img5;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img6 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img6;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img7 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img7;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            if (job.img8 !== '') {
                box = document.createElement('div');
                box.className = 'd-flex flex-row align-items-center mx-2 mt-2';
                row.appendChild(box);

                img = document.createElement('img');
                img.src = job.img8;
                img.className = 'img-fluid border border-secondary rounded-4';
                img.style.maxWidth = '200px';
                box.appendChild(img);
            }

            let chatArea = document.createElement('div');
            chatArea.className = 'd-flex flex-column align-items-center w-100 mt-3';
            chatArea.style.height = '400px';
            chatArea.style.overflowY = 'scroll';
            section.appendChild(chatArea);

            let messages = JSON.parse(job.messages);

            if (messages.length === 0) {
                let messageBox = document.createElement('div');
                messageBox.className = 'd-flex flex-column align-items-center w-75 mt-2';
                messageBox.innerHTML = 'Niciun mesaj';
                chatArea.appendChild(messageBox);
            }
            else {
                for (let message of messages) {
                    let messageBox = document.createElement('div');
                    messageBox.className = 'd-flex flex-column align-items-center w-75 mt-2 border border-secondary rounded-4 p-2';
                    chatArea.appendChild(messageBox);

                    let span = document.createElement('span');
                    span.innerText = message.name + ': ' + General.formatDateTime(new Date(parseInt(message.timestamp) * 1000));
                    span.className = 'fw-bold text-secondary fs-5 text-nowrap bg-light w-100';
                    messageBox.appendChild(span);

                    let p = document.createElement('p');
                    p.innerText = message.message;
                    p.className = 'text-center mt-2 w-100 p-2';
                    p.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
                    messageBox.appendChild(p);
                }
            }

            chatArea.scrollTop = chatArea.scrollHeight;

            let messageBox = document.createElement('div');
            messageBox.className = 'd-flex flex-row align-items-center w-100 mt-3';
            section.appendChild(messageBox);

            let input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.name = 'message';
            input.placeholder = 'Mesaj';
            messageBox.appendChild(input);

            let button = document.createElement('button');
            button.className = 'btn-industrial ms-2';
            button.innerHTML = '<i class="bi bi-airplane-engines"></i> Trimite';
            button.onclick = () => { General.sendMessage(job.id, input.value) };
            messageBox.appendChild(button);
        }
    }

    static async rate(id_job, grade, review) {
        let data = {
            id_job: id_job,
            grade: grade,
            review: review
        };

        let response = await fetch(localStorage.getItem('host') + '/rate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        General.sendNotification('Firma a fost evaluata cu success', 'success');
        User.myJobs();
    }

    static async reviews() {
        General.selectActiveTab('Recenzii');

        let main = document.querySelector('main');
        main.innerHTML = '';

        let response = await fetch(localStorage.getItem('host') + '/getReviews');
        let result = await response.json();

        if (result.status === false) {
            General.sendNotification(result.message, 'danger');
            console.error(result.error);
            return;
        }

        let data = result.data;

        let page = document.createElement('div');
        page.className = 'd-flex flex-column align-items-center w-100 p-4';
        main.appendChild(page);

        for (let r of data) {
            let section = document.createElement('section');
            section.className = 'd-flex flex-row p-4 rounded-4 mt-5 w-100';
            section.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.7), 0 2px 10px rgba(0, 0, 0, 0.3)';
            section.style.border = '4px solid #555';
            section.style.borderRadius = '8px';
            page.appendChild(section);

            let img = document.createElement('img');
            img.src = r.logo;
            img.className = 'img-fluid border border-secondary rounded-4';
            img.style.maxWidth = '200px';
            section.appendChild(img);

            let div = document.createElement('div');
            div.className = 'd-flex flex-column align-items-center ms-5 w-100';
            section.appendChild(div);

            let row = document.createElement('div');
            row.className = 'd-flex flex-row align-items-center w-100 mt-3 justify-content-center';
            div.appendChild(row);

            let h2 = document.createElement('h2');
            h2.innerText = r.name;
            row.appendChild(h2);

            let starBox = document.createElement('div');
            starBox.className = 'd-flex flex-row align-items-center ms-3';
            starBox.style.width = '140px';
            starBox.style.height = '42px';
            row.appendChild(starBox);

            for (let i = 0; i < 5; i++) {
                let star = document.createElement('i');
                star.className = 'bi bi-star-fill text-warning fs-3';
                starBox.appendChild(star);
            }

            let toCoverByRights = 10 - r.grade;
            toCoverByRights *= 14;

            let cover = document.createElement('div');
            cover.className = 'd-flex flex-row align-items-center';
            cover.style.width = toCoverByRights.toString() + 'px';
            cover.style.height = '42px';
            cover.style.overflow = 'hidden';
            cover.style.background = 'white';
            cover.style.position = 'absolute';
            cover.style.zIndex = '999';
            cover.style.marginLeft = (140 - toCoverByRights).toString() + 'px';
            starBox.appendChild(cover);

            let p = document.createElement('p');
            p.innerHTML = '&emsp;' + r.review;
            p.className = 'mt-3 w-100 p-3 rounded-4';
            p.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
            div.appendChild(p);
        }
    }
}