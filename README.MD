#

#

# PRODUCT

GET http://localhost:7000/product Ürünleri json formatında getirir
POST http://localhost:7000/product Ürün oluşturur
POST http://localhost:7000/product/delete İd si verilen ürünü siler
POST http://localhost:7000/product/uptade İd si verilen ürünü günceller

# CUSTOMER

GET http://localhost:7000/customer Müşteri bilgilerini json formatında getirir
POST http://localhost:7000/customer Ürünü satın alanın bilgilerini oluşturur

#

POST http://localhost:7000/login Kullanıcı ve şifre giriniz eğer sistemde kayıtlıysa token ve refTOken döner

############    ÇALIŞAN PORTU KAPATMA KOMUTU    ############
###                                                      ###  
###                                                      ### 
###          sudo kill $(sudo lsof -t -i:3000)           ### 
###                                                      ### 
###                                                      ### 
############################################################
