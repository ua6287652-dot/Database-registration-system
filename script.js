// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL =
    "https://YOUR-PROJECT-ID.supabase.co";

const SUPABASE_KEY =
    "YOUR-PUBLISHABLE-OR-ANON-KEY";


const { createClient } =
    supabase;


const supabaseClient =
    createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "registerName"
                ).value.trim();


            const email =
                document.getElementById(
                    "registerEmail"
                ).value.trim();


            const phone =
                document.getElementById(
                    "registerPhone"
                ).value.trim();


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;


            const message =
                document.getElementById(
                    "registerMessage"
                );


            // Password check

            if (password !== confirmPassword) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Passwords do not match.
                    </div>
                `;

                return;

            }


            if (password.length < 6) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        Password must be at least 6 characters.
                    </div>
                `;

                return;

            }


            // Loading

            message.innerHTML = `
                <div class="alert alert-info">
                    Creating your account...
                </div>
            `;


            // Supabase Sign Up

            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            name: name,

                            phone: phone

                        }

                    }

                });


            // Error

            if (error) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        ${error.message}
                    </div>
                `;

                return;

            }


            // Success

            message.innerHTML = `
                <div class="alert alert-success">

                    Account created successfully!

                    ${
                        data.session
                        ? "Redirecting..."
                        : "Please check your email to verify your account."
                    }

                </div>
            `;


            // If email confirmation disabled

            if (data.session) {

                setTimeout(() => {

                    window.location.href =
                        "dashboard.html";

                }, 1000);

            }
            else {

                setTimeout(() => {

                    window.location.href =
                        "index.html";

                }, 3000);

            }

        }
    );

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const message =
                document.getElementById(
                    "loginMessage"
                );


            message.innerHTML = `
                <div class="alert alert-info">
                    Logging in...
                </div>
            `;


            // Login

            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            // Error

            if (error) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        ${error.message}
                    </div>
                `;

                return;

            }


            // Success

            message.innerHTML = `
                <div class="alert alert-success">
                    Login successful!
                </div>
            `;


            setTimeout(() => {

                window.location.href =
                    "dashboard.html";

            }, 700);

        }
    );

}


// ==========================================
// DASHBOARD
// ==========================================

async function loadDashboard() {


    // Get current user

    const {
        data: {
            user
        }
    } =
        await supabaseClient.auth.getUser();


    // No user

    if (!user) {

        window.location.href =
            "index.html";

        return;

    }


    // Get profile

    const {
        data: profile,
        error
    } =
        await supabaseClient

            .from("profiles")

            .select("*")

            .eq("id", user.id)

            .single();


    if (error) {

        console.error(error);

        return;

    }


    // Navbar

    const navName =
        document.getElementById(
            "navUserName"
        );


    const navEmail =
        document.getElementById(
            "navUserEmail"
        );


    if (navName)
        navName.textContent =
            profile.name;


    if (navEmail)
        navEmail.textContent =
            user.email;


    // Welcome

    const welcomeName =
        document.getElementById(
            "welcomeName"
        );


    if (welcomeName)
        welcomeName.textContent =
            profile.name;


    // Email card

    const cardEmail =
        document.getElementById(
            "cardEmail"
        );


    if (cardEmail)
        cardEmail.textContent =
            user.email;


    // Profile fields

    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profilePhone =
        document.getElementById(
            "profilePhone"
        );


    const profileCreated =
        document.getElementById(
            "profileCreated"
        );


    if (profileName)
        profileName.value =
            profile.name || "";


    if (profileEmail)
        profileEmail.value =
            user.email || "";


    if (profilePhone)
        profilePhone.value =
            profile.phone || "";


    if (profileCreated)
        profileCreated.value =
            new Date(
                profile.created_at
            ).toLocaleDateString();


    // Member since

    const memberSince =
        document.getElementById(
            "memberSince"
        );


    if (memberSince) {

        memberSince.textContent =
            new Date(
                profile.created_at
            ).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

    }

}


// ==========================================
// UPDATE PROFILE
// ==========================================

const profileForm =
    document.getElementById(
        "profileForm"
    );


if (profileForm) {

    loadDashboard();


    profileForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "profileName"
                ).value.trim();


            const phone =
                document.getElementById(
                    "profilePhone"
                ).value.trim();


            const message =
                document.getElementById(
                    "profileMessage"
                );


            const {
                data: {
                    user
                }
            } =
                await supabaseClient.auth.getUser();


            if (!user) {

                window.location.href =
                    "index.html";

                return;

            }


            // Update profile

            const {
                error
            } =
                await supabaseClient

                    .from("profiles")

                    .update({

                        name: name,

                        phone: phone,

                        updated_at:
                            new Date().toISOString()

                    })

                    .eq("id", user.id);


            if (error) {

                message.innerHTML = `
                    <div class="alert alert-danger">
                        ${error.message}
                    </div>
                `;

                return;

            }


            message.innerHTML = `
                <div class="alert alert-success">
                    Profile updated successfully!
                </div>
            `;


            loadDashboard();

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function() {


            const {
                error
            } =
                await supabaseClient.auth.signOut();


            if (!error) {

                window.location.href =
                    "index.html";

            }

        }
    );

}