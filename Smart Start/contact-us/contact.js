document.addEventListener("DOMContentLoaded", () => {
  console.log("Contact form script loaded")

  const contactForm = document.getElementById("contactForm")
  const successMessage = document.getElementById("successMessage")
  const submitBtn = contactForm?.querySelector(".submit-btn")
  const btnText = submitBtn?.querySelector(".btn-text")
  const btnLoading = submitBtn?.querySelector(".btn-loading")

  if (!contactForm || !submitBtn) {
    console.error("Required elements not found!")
    return
  }

  console.log("All elements found successfully")

  // معالجة إرسال النموذج
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log("Form submitted")

    // جمع البيانات
    const formData = new FormData(contactForm)

    // التحقق من البيانات المطلوبة
    const name = formData.get("name")?.trim()
    const email = formData.get("email")?.trim()
    const userType = formData.get("userType")?.trim()
    const subject = formData.get("subject")?.trim()
    const message = formData.get("message")?.trim()

    if (!name || !email || !userType || !subject || !message) {
      alert("يرجى ملء جميع الحقول المطلوبة")
      return
    }

    // إظهار حالة التحميل
    submitBtn.disabled = true
    if (btnText) btnText.style.display = "none"
    if (btnLoading) btnLoading.style.display = "inline"

    try {
      console.log("Sending request to contact.php...")

      const response = await fetch("contact.php", {
        method: "POST",
        body: formData,
      })

      console.log("Response status:", response.status)

      const responseText = await response.text()
      console.log("Response text:", responseText)

      if (responseText.trim() === "success") {
        // إخفاء النموذج وإظهار رسالة النجاح
        contactForm.style.display = "none"
        if (successMessage) {
          successMessage.style.display = "block"
          successMessage.scrollIntoView({ behavior: "smooth" })
        }
        alert("تم إرسال الرسالة بنجاح!")
        console.log("Message sent successfully!")
      } else {
        alert("خطأ: " + responseText)
        console.error("Server error:", responseText)
      }
    } catch (error) {
      console.error("Request failed:", error)
      alert("خطأ في الشبكة: " + error.message)
    } finally {
      // إعادة تعيين حالة الزر
      submitBtn.disabled = false
      if (btnText) btnText.style.display = "inline"
      if (btnLoading) btnLoading.style.display = "none"
    }
  })

  // اختبار النقر على الزر
  submitBtn.addEventListener("click", () => {
    console.log("Submit button clicked")
  })
})
