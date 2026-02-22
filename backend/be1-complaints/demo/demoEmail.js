const demoEmail = {
    createTransport: (config) => ({
        sendMail: async (mailOptions) => {
            console.log("\n📧 [EXPERIMENTAL MODE] Simulated Email Sent");
            console.log("To:", mailOptions.to);
            console.log("Subject:", mailOptions.subject);
            console.log("Content Preview:", mailOptions.text || mailOptions.html.substring(0, 100) + "...");
            console.log("---------------------------------------------------\n");
            return { response: "250 Simulated OK" };
        }
    })
};

module.exports = demoEmail;
