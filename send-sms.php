<?php

class ServiceCallService extends SoapClient
{
    public function __construct(array $options=array(), $wsdl='http://10.20.9.8:8085/ws/Send?wsdl')
    {
        $options = array_merge(array('features' => 1), $options);
        parent::__construct($wsdl, $options);
    }

    public function ServiceSend($parameters)
    {
        return $this->__soapCall('ServiceSend', array($parameters));
    }
}

try {
    $client = new ServiceCallService();

    $response = $client->ServiceSend(
        array(
            'username' => 'kishfreezone',
            'password' => '70fc0b97f4fb6d8c5e16f81a4f4351b0',
            'domain' => 'maat',
            'msgType' => 0,
            'messages' => array('test message for ServiceSend'),
            'destinations' => array('989124549919'),
            'originators' => array('6122'),
            'udhs' => array(1),
            'mClass' => array(0),
            'ServiceIds' => array('11319')
        )
    );
    var_dump($response);
    echo $response;
} catch(SoapFault $e) {
    var_dump($e);
}
